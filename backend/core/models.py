from django.db import models

class BusinessInfo(models.Model):
    name = models.CharField(max_length=100, default="NESTORA")
    email = models.EmailField(default="hello@nestora.com")
    phone = models.CharField(max_length=20, default="+1 (800) 123-4567")
    address = models.CharField(max_length=255, default="1420 Wilshire Blvd, Suite 800 Los Angeles, CA 90017")

class HeroSection(models.Model):
    heading = models.CharField(max_length=200, default="Find a Place Worth Calling Home.")
    subheading = models.TextField()
    primary_cta_text = models.CharField(max_length=50, default="EXPLORE PROPERTIES")
    
class PropertyCategory(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Property(models.Model):
    STATUS_CHOICES = [('NEW LISTING', 'New Listing'), ('EXCLUSIVE', 'Exclusive'), ('PRICE REDUCED', 'Price Reduced')]
    
    title = models.CharField(max_length=200)
    category = models.ForeignKey(PropertyCategory, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=100)
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    area_sqft = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    main_image = models.ImageField(upload_to='properties/', blank=True, null=True) # Added this for the image
    
    def __str__(self):
        return self.title

# --- ADDED THESE TWO MODELS ---
class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    customer_name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    quote = models.TextField()

    def __str__(self):
        return self.customer_name
# ------------------------------

class ContactEnquiry(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.full_name