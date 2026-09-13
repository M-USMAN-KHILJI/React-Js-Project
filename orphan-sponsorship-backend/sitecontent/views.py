from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core.mail import send_mail
from django.db.models import Sum

from orphans.models import Orphan
from donors.models import Donation
from schools.models import School
from users.models import CustomUser
from users.permissions import IsAdmin
from orphans.serializers import OrphanListSerializer
from .serializers import (
    ContactMessageSerializer,
    FeedbackEntrySerializer,
    NewsletterSubscriberSerializer,
)
from .models import NewsletterSubscriber, FeedbackEntry


class PublicStatsView(APIView):
    """GET /api/public/stats/ -- live homepage counters (no login required)."""

    permission_classes = [AllowAny]

    def get(self, request):
        total_orphans = Orphan.objects.filter(application_status='Approved').count()
        total_donors = CustomUser.objects.filter(role='donor').count()
        total_schools = School.objects.count()
        total_raised = Donation.objects.filter(payment_status='paid').aggregate(
            total=Sum('amount')
        )['total'] or 0

        return Response(
            {
                'verifiedOrphans': total_orphans,
                'activeDonors': total_donors,
                'partnerSchools': total_schools,
                'donationsRaised': float(total_raised),
            }
        )


class PublicFeaturedOrphansView(APIView):
    """GET /api/public/featured-orphans/ -- approved orphans for homepage."""

    permission_classes = [AllowAny]

    def get(self, request):
        orphans = Orphan.objects.filter(application_status='Approved').order_by('-submitted_at')[:8]
        serializer = OrphanListSerializer(orphans, many=True, context={'request': request})
        return Response(serializer.data)


class ContactMessageCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Thank you. Your message has been received.'},
                status=201,
            )
        return Response(serializer.errors, status=400)


class FeedbackCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = FeedbackEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Thank you for your feedback.'},
                status=201,
            )
        return Response(serializer.errors, status=400)


class AdminFeedbackListView(APIView):
    """GET /api/admin/feedback/ -- website feedback for NGO admin."""

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        entries = FeedbackEntry.objects.all().order_by('-created_at')
        serializer = FeedbackEntrySerializer(entries, many=True)
        return Response(serializer.data)


class AdminNewsletterListView(APIView):
    """GET /api/admin/newsletter/ -- subscribed emails for NGO admin."""

    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        subscribers = NewsletterSubscriber.objects.all().order_by('-created_at')
        serializer = NewsletterSubscriberSerializer(subscribers, many=True)
        return Response(serializer.data)


class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        if not email:
            return Response({'email': ['Please enter your email address.']}, status=400)

        existing = NewsletterSubscriber.objects.filter(email__iexact=email).first()
        if existing:
            return Response(
                {'message': 'You are already subscribed.', 'already_subscribed': True},
                status=409,
            )

        serializer = NewsletterSubscriberSerializer(data={'email': email})
        if serializer.is_valid():
            serializer.save()
            try:
                send_mail(
                    subject='Subscribed to Orphan Sponsorship Portal',
                    message=(
                        'Thank you for subscribing to the Orphan Sponsorship Portal.\n\n'
                        'You have successfully subscribed to our updates. '
                        'You will receive news about orphan profiles, sponsorship opportunities, '
                        'and stories of impact.\n\n'
                        'Orphan Educational Sponsorship and Tracking System (OESTS)'
                    ),
                    from_email=None,
                    recipient_list=[email],
                    fail_silently=True,
                )
            except Exception:
                pass
            return Response({'message': 'Thanks for subscribing! A confirmation email has been sent.'}, status=201)
        return Response(serializer.errors, status=400)
