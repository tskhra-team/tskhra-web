import {
  getDayName,
  minutesToTime,
  mockBusinesses,
} from "@/Booking/mockBusinesses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  MapPin,
  Phone,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  const business = mockBusinesses[Number(id)];

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business not found</h1>
          <Button onClick={() => navigate("/services")}>
            Back to Businesses
          </Button>
        </div>
      </div>
    );
  }

  // Get call type badge color
  const getCallTypeBadge = () => {
    switch (business.callType) {
      case "outcall":
        return <Badge variant="secondary">Outcall Only</Badge>;
      case "onsite":
        return <Badge variant="default">Onsite Only</Badge>;
      case "both":
        return <Badge variant="outline">Outcall & Onsite</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <button
          onClick={() => navigate("/")}
          className="hover:text-foreground transition-colors"
        >
          Home
        </button>
        <span>•</span>
        <button
          onClick={() => navigate("/services")}
          className="hover:text-foreground transition-colors"
        >
          Services
        </button>
        <span>•</span>
        <span className="text-foreground font-medium">{business.businessName}</span>
      </div>

      {/* Business Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold">{business.businessName}</h1>
          {getCallTypeBadge()}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="w-4 h-4" />
          <span>{business.category}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <img
              src={business.mainImageUrl}
              alt={business.businessName}
              loading="eager"
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gallery */}
          {business.galleryImageUrls && business.galleryImageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {business.galleryImageUrls.map((url: string, index: number) => (
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
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card ref={servicesRef}>
            <CardHeader>
              <CardTitle>Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {business.services.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <div className="text-right">
                        <p className="text-xl font-bold">₾{service.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.time >= 60
                            ? `${Math.floor(service.time / 60)}h ${service.time % 60 > 0 ? `${service.time % 60}m` : ""}`
                            : `${service.time}m`}
                        </p>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

         
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  {business.address && (
                    <p className="font-medium">{business.address}</p>
                  )}
                  <p className="text-muted-foreground">{business.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>{business.businessName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full cursor-pointer" size="lg" onClick={scrollToServices}>
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {business.info.phoneNumber && (
                <a
                  href={`tel:${business.info.phoneNumber}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{business.info.phoneNumber}</span>
                </a>
              )}

              {business.info.facebookUrl && (
                <a
                  href={business.info.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">Facebook</span>
                </a>
              )}

              {business.info.instagramUrl && (
                <a
                  href={business.info.instagramUrl}
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
           <Card>
            <CardContent>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowWorkingHours(!showWorkingHours)}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    Open until {minutesToTime(business.workTimes[new Date().getDay()]?.endTime || business.workTimes[0].endTime)}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${showWorkingHours ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Days list */}
              {showWorkingHours && (
                <div className="space-y-3 mt-4 pt-3 border-t">
                  {business.workTimes.map((workTime, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>{getDayName(workTime.day)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {minutesToTime(workTime.startTime)} - {minutesToTime(workTime.endTime)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
