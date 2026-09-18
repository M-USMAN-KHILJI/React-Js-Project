from django.urls import path
from .views import (
    PublicStatsView,
    PublicFeaturedOrphansView,
    PublicAcceptedFeedbackView,
    ContactMessageCreateView,
    AdminContactMessageListView,
    FeedbackCreateView,
    AdminFeedbackListView,
    AdminAcceptFeedbackView,
    AdminRejectFeedbackView,
    AdminNewsletterListView,
    NewsletterSubscribeView,
)

urlpatterns = [
    path('public/stats/', PublicStatsView.as_view(), name='public-stats'),
    path('public/featured-orphans/', PublicFeaturedOrphansView.as_view(), name='public-featured-orphans'),
    path('public/feedback/', PublicAcceptedFeedbackView.as_view(), name='public-feedback'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
    path('admin/contact-messages/', AdminContactMessageListView.as_view(), name='admin-contact-messages'),
    path('feedback/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('admin/feedback/', AdminFeedbackListView.as_view(), name='admin-feedback'),
    path('admin/feedback/<int:feedback_id>/accept/', AdminAcceptFeedbackView.as_view(), name='admin-feedback-accept'),
    path('admin/feedback/<int:feedback_id>/reject/', AdminRejectFeedbackView.as_view(), name='admin-feedback-reject'),
    path('admin/newsletter/', AdminNewsletterListView.as_view(), name='admin-newsletter'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]
