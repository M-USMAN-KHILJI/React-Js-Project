from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsSchool, IsAdmin
from orphans.models import Orphan
from .models import AcademicRecord
from .serializers import AcademicRecordSerializer, AcademicRecordReadSerializer


class SubmitReportView(APIView):
    """POST /api/reports/submit/ -- a school submits a monthly academic report."""

    permission_classes = [IsAuthenticated, IsSchool]

    def post(self, request):
        orphan_id = request.data.get('orphan')
        try:
            orphan = Orphan.objects.get(id=orphan_id)
        except Orphan.DoesNotExist:
            return Response({'message': 'Student not found.'}, status=404)

        # Security check: school can only report on its own enrolled students
        from orphans.views import _students_for_school

        if not _students_for_school(request.user).filter(id=orphan.id).exists():
            return Response(
                {'message': 'You can only submit reports for students enrolled at your own school.'},
                status=403
            )

        serializer = AcademicRecordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Monthly report submitted successfully.'}, status=201)
        return Response(serializer.errors, status=400)


class StudentReportsView(APIView):
    """
    GET /api/reports/<orphan_id>/ -- shows the report history for one orphan child.
    To protect the child's privacy, only these people can view it:
    - The NGO Admin
    - A donor who has actually sponsored this specific child
    - The guardian who submitted this child's application
    - Any School account (needed to review their own submissions)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, orphan_id):
        from donors.models import Donation

        try:
            orphan = Orphan.objects.get(id=orphan_id)
        except Orphan.DoesNotExist:
            return Response({'message': 'Orphan not found.'}, status=404)

        user = request.user
        is_admin = user.role == 'admin'
        is_school = user.role == 'school'
        is_guardian = user.role == 'orphan' and orphan.guardian_id == user.id
        is_sponsor = user.role == 'donor' and Donation.objects.filter(orphan=orphan, donor=user).exists()

        if not (is_admin or is_school or is_guardian or is_sponsor):
            return Response(
                {'message': 'You can only view the progress report of a child you are sponsoring.'},
                status=403
            )

        records = orphan.academic_records.all().order_by('-submitted_at')
        serializer = AcademicRecordReadSerializer(records, many=True, context={'request': request})

        return Response({
            'name': orphan.full_name,
            'className': orphan.student_class,
            'school': orphan.school_name_text,
            'records': serializer.data,
        })


class MySubmittedReportsView(APIView):
    """GET /api/reports/my-submissions/ -- School sees all reports it has submitted."""

    permission_classes = [IsAuthenticated, IsSchool]

    def get(self, request):
        records = AcademicRecord.objects.filter(submitted_by=request.user).order_by('-submitted_at')
        data = []
        for record in records:
            data.append({
                'id': record.id,
                'student_name': record.orphan.full_name,
                'report_month': record.report_month,
                'attendance': record.attendance_percentage,
                'average_marks': record.average_marks,
                'submitted_at': record.submitted_at,
            })
        return Response(data)


class AdminReportsListView(APIView):
    """GET /api/admin/reports/ -- all monthly student reports for NGO admin."""

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        records = (
            AcademicRecord.objects.select_related('orphan', 'orphan__school', 'submitted_by')
            .order_by('-submitted_at')
        )
        data = []
        for record in records:
            school_name = None
            if record.orphan.school_id and record.orphan.school:
                school_name = record.orphan.school.school_name
            elif record.submitted_by_id:
                school_name = record.submitted_by.full_name
            else:
                school_name = record.orphan.school_name_text or '—'

            report_card_url = None
            if record.report_card:
                report_card_url = request.build_absolute_uri(record.report_card.url)

            data.append({
                'id': record.id,
                'student_name': record.orphan.full_name,
                'student_class': record.orphan.student_class or '—',
                'school_name': school_name,
                'report_month': record.report_month,
                'total_school_days': record.total_school_days,
                'days_present': record.days_present,
                'attendance': record.attendance_percentage,
                'average_marks': float(record.average_marks),
                'teacher_comments': record.teacher_comments,
                'report_card': report_card_url,
                'submitted_at': record.submitted_at,
            })
        return Response(data)
