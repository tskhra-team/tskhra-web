import { mockServices } from "@/Booking/mockSerrvices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Globe,
  Facebook,
  Instagram,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = mockServices[Number(id)];

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => navigate("/services")}>
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/services")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={service.mainImageUrl}
              alt={service.title}
              loading="eager"
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gallery */}
          {service.galleryImageUrls && service.galleryImageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {service.galleryImageUrls.map((url, index) => (
                <div
                  key={index}
                  className="aspect-video overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    loading="lazy"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">{service.categoryId}</p>
                </div>
                {service.subcategoryId && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Subcategory
                    </p>
                    <p className="font-medium">{service.subcategoryId}</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{service.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.city}
                    {service.district && `, ${service.district}`}
                  </p>
                </div>
              </div>

              {service.estimatedTime && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Estimated Time
                      </p>
                      <p className="font-medium">{service.estimatedTime}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                <div>
                  <p className="text-3xl font-bold">{service.price}</p>
                  {service.priceMin && service.priceMax && (
                    <p className="text-sm text-muted-foreground">
                      Range: ${service.priceMin} - ${service.priceMax}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <Button className="w-full" size="lg">
                Book Now
              </Button>
              <Button className="w-full" variant="outline">
                Contact Provider
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={`mailto:${service.email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">{service.email}</span>
              </a>

              {service.websiteUrl && (
                <a
                  href={service.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">Website</span>
                </a>
              )}

              {service.facebookUrl && (
                <a
                  href={service.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">Facebook</span>
                </a>
              )}

              {service.instagramUrl && (
                <a
                  href={service.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm">Instagram</span>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
