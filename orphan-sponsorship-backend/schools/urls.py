from django.urls import path
from .views import (
    SubmitReportView,
    StudentReportsView,
    MySubmittedReportsView,
    AdminReportsListView,
)

urlpatterns = [
    path('reports/submit/', SubmitReportView.as_view(), name='submit-report'),
    path('reports/my-submissions/', MySubmittedReportsView.as_view(), name='my-submitted-reports'),
    path('reports/<int:orphan_id>/', StudentReportsView.as_view(), name='student-reports'),
    path('admin/reports/', AdminReportsListView.as_view(), name='admin-reports'),
]