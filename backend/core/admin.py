from django.contrib import admin
from .models import BusinessInfo, HeroSection, PropertyCategory, Property, ContactEnquiry, Service, Testimonial

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'location', 'status')

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'created_at')
    readonly_fields = ('created_at',)

admin.site.register([BusinessInfo, HeroSection, PropertyCategory, Service, Testimonial])