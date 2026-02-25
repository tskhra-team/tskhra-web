import { Button } from "@/components/ui/button";
import { scrollToTop } from "@/utils";
import { Briefcase, User } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import IndividualServiceForm from "./IndividualServiceForm";

export default function CreateBookingService() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("type");

  if (selectedType === "individual" || selectedType === "business") {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="link"
          onClick={() => setSearchParams({})}
          className="mb-4"
        >
          ← Back to selection
        </Button>

        {selectedType === "individual" ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Individual Business</h1>
            <IndividualServiceForm />{" "}
            {/*here should be IndividualServiceForm */}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">Commercial Business</h1>
            <IndividualServiceForm /> {/*here should be BusinessServiceForm */}
          </>
        )}
      </div>
    );
  }

  const handleClick = (type: string) => {
    setSearchParams({ type: type });
    scrollToTop();
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Booking Service
          </h1>
          <p className="text-lg text-gray-600">
            Choose the type of service you want to offer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Individual Service Card */}
          <div className="relative bg-white rounded-xl border border-slate-300 shadow-sm">
            <div className="p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-700" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 text-center mb-3">
                Individual Business
              </h2>
              <p className="text-slate-600 text-center mb-8 leading-relaxed text-sm">
                Perfect for freelancers and solo professionals offering personal
                services like tutoring, consulting, or personal training.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    Simple setup and management
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    Direct client communication
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-slate-500 mr-3 text-base">✓</span>
                  <span className="text-slate-700 text-sm">
                    Flexible scheduling options
                  </span>
                </li>
              </ul>
              <Button
                onClick={() => handleClick("individual")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11 cursor-pointer"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Business Service Card */}
          <div className="relative bg-gray-100 rounded-xl border border-gray-300 shadow-sm opacity-60">
            <div className="absolute top-4 right-4 bg-slate-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
              Coming Soon
            </div>
            <div className="p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-gray-500" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 text-center mb-3">
                Commercial Business
              </h2>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                Ideal for companies and organizations offering professional
                services with multiple team members and locations.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    Multi-location support
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    Team management tools
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 text-base">✓</span>
                  <span className="text-gray-500 text-sm">
                    Advanced analytics & reporting
                  </span>
                </li>
              </ul>
              <Button
                disabled
                className="w-full bg-gray-400 text-white font-medium h-11 cursor-not-allowed"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
