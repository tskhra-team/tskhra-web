import { mockServices } from "@/Booking/mockSerrvices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServicesCatalog() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">კატალოგი</h1>
        <p className="text-muted-foreground">
          Browse our collection of professional services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/services/${index}`)}
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={service.mainImageUrl}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl line-clamp-2">
                  {service.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {service.city}
                  {service.district && `, ${service.district}`}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{service.estimatedTime || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-lg">
                  <DollarSign className="w-5 h-5" />
                  <span>{service.price}</span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
