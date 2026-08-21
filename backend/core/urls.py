from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyViewSet, TestimonialViewSet, ServiceViewSet, 
    BusinessInfoViewSet, ContactEnquiryViewSet, HeroSectionViewSet
)

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'business', BusinessInfoViewSet)
router.register(r'contact', ContactEnquiryViewSet)
# --- ADDED THIS ---
router.register(r'hero', HeroSectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]