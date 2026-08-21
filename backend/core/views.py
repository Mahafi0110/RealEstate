from rest_framework import viewsets, mixins
from .models import Property, Testimonial, Service, BusinessInfo, ContactEnquiry, HeroSection
from .serializers import (
    PropertySerializer, TestimonialSerializer, ServiceSerializer, 
    BusinessInfoSerializer, ContactEnquirySerializer, HeroSectionSerializer
)

class PropertyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class BusinessInfoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BusinessInfo.objects.all()
    serializer_class = BusinessInfoSerializer

# --- ADDED THIS FOR THE HERO SECTION ---
class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer

class ContactEnquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactEnquiry.objects.all()
    serializer_class = ContactEnquirySerializer