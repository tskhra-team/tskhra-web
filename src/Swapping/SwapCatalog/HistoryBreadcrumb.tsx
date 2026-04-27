import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSwappingCategories from "@/shared/api/useGetSwappingCategories";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export default function HistoryBreadcrumb() {
  const { t } = useTranslation(["swapping"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("c");
  const subCategory = searchParams.get("sc");
  const search = searchParams.get("s");
  const isActive = category || subCategory || search;

  const { data: categories, isLoading } = useGetSwappingCategories();

  const handleLevelClick = (level: "all" | "category" | "subcategory") => {
    if (level === "all") {
      setSearchParams({});
    } else if (level === "category") {
      const params = new URLSearchParams(searchParams);
      params.delete("sc");
      params.delete("s");
      setSearchParams(params);
    } else if (level === "subcategory") {
      const params = new URLSearchParams(searchParams);
      params.delete("s");
      setSearchParams(params);
    }
  };

  const selectedCatObj = categories?.find(
    (c) => String(c.id) === String(category),
  );
  const selectedSubCatObj = selectedCatObj?.children?.find(
    (s) => String(s.id) === String(subCategory),
  );

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="breadcrumb-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="pb-10"
        >
          <Breadcrumb>
            {isLoading ? (
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Skeleton className="w-12 h-4" />
                </BreadcrumbItem>

                {category && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Skeleton className="w-20 h-4" />
                    </BreadcrumbItem>
                  </>
                )}

                {subCategory && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Skeleton className="w-24 h-4" />
                    </BreadcrumbItem>
                  </>
                )}

                {search && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Skeleton className="w-16 h-4" />
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            ) : (
              <BreadcrumbList>
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => handleLevelClick("all")}
                      className="cursor-pointer"
                    >
                      {t("catalog.all")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </motion.div>

                <AnimatePresence>
                  {category && (
                    <motion.div
                      key="cat"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center gap-1.5 sm:gap-2.5"
                    >
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          onClick={() => handleLevelClick("category")}
                          className="cursor-pointer"
                        >
                          {selectedCatObj?.name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {subCategory && (
                    <motion.div
                      key="subcat"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center gap-1.5 sm:gap-2.5"
                    >
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          onClick={() => handleLevelClick("subcategory")}
                          className="cursor-pointer"
                        >
                          {selectedSubCatObj?.name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {search && (
                    <motion.div
                      key="search"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center gap-1.5 sm:gap-2.5"
                    >
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink>{search}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </motion.div>
                  )}
                </AnimatePresence>
              </BreadcrumbList>
            )}
          </Breadcrumb>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
