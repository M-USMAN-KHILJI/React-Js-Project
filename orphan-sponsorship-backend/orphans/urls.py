from django.urls import path
from .views import (
    OrphanApplyView,
    MyApplicationView,
    OrphanListView,
    MyStudentsView,
    AdminApplicationsListView,
    AdminOrphanDetailView,
    AdminSchoolsListView,
    AdminApproveOrphanView,
    AdminRejectOrphanView,
    AdminDashboardView,
)
urlpatterns = [
    path('orphans/', OrphanListView.as_view(), name='orphan-list'),
    path('orphans/apply/', OrphanApplyView.as_view(), name='orphan-apply'),
    path('orphans/my-application/', MyApplicationView.as_view(), name='my-application'),
    path('orphans/my-students/', MyStudentsView.as_view(), name='my-students'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/applications/', AdminApplicationsListView.as_view(), name='admin-applications'),
    path('admin/schools/', AdminSchoolsListView.as_view(), name='admin-schools'),
    path('admin/orphans/<int:orphan_id>/', AdminOrphanDetailView.as_view(), name='orphan-detail'),
    path('admin/orphans/<int:orphan_id>/approve/', AdminApproveOrphanView.as_view(), name='orphan-approve'),
    path('admin/orphans/<int:orphan_id>/reject/', AdminRejectOrphanView.as_view(), name='orphan-reject'),
]