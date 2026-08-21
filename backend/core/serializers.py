from rest_framework import serializers
from .models import Property, Testimonial, Service, BusinessInfo, ContactEnquiry, HeroSection

class PropertySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='title')
    
    # Safely handle the badge (status) in case you leave it blank
    badge = serializers.SerializerMethodField()
    
    # Map the React keys to the Django model names!
    beds = serializers.IntegerField(source='bedrooms')
    baths = serializers.IntegerField(source='bathrooms')
    
    image = serializers.SerializerMethodField()
    sqft = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'badge', 'name', 'location', 'price', 'image', 'beds', 'baths', 'sqft']

    def get_badge(self, obj):
        return obj.get_status_display() if obj.status else ""

    def get_image(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return f"http://localhost:8000{obj.main_image.url}"
        return ""

    def get_sqft(self, obj):
        return f"{obj.area_sqft:,}" if obj.area_sqft else ""

    def get_price(self, obj):
        return f"${int(obj.price):,}" if obj.price else ""

class TestimonialSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='customer_name')
    initial = serializers.SerializerMethodField()
    stars = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = ['name', 'role', 'initial', 'stars', 'quote']

    def get_initial(self, obj):
        return obj.customer_name[0].upper() if obj.customer_name else ""
        
    def get_stars(self, obj):
        return 5 

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['title', 'description']

class BusinessInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessInfo
        fields = '__all__'

# --- ADDED THIS FOR THE HERO SECTION ---
class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = '__all__'

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = ['full_name', 'email', 'message']