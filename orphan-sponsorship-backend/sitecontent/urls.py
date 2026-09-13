from django.urls import path
from .views import (
    PublicStatsView,
    PublicFeaturedOrphansView,
    ContactMessageCreateView,
    FeedbackCreateView,
    AdminFeedbackListView,
    AdminNewsletterListView,
    NewsletterSubscribeView,
)

urlpatterns = [
    path('public/stats/', PublicStatsView.as_view(), name='public-stats'),
    path('public/featured-orphans/', PublicFeaturedOrphansView.as_view(), name='public-featured-orphans'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
    path('feedback/', FeedbackCreateView.as_view(), name='feedback-create'),
    path('admin/feedback/', AdminFeedbackListView.as_view(), name='admin-feedback'),
    path('admin/newsletter/', AdminNewsletterListView.as_view(), name='admin-newsletter'),
    path('newsletter/subscribe/', NewsletterSubscribeView.as_view(), name='newsletter-subscribe'),
]
