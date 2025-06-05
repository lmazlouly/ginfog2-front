import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import React from "react";
import { useBreadcrumbs } from "@/contexts/breadcrumb-context";

type breadcrumbItem = {
  label: string;
  href: string;
  clickable?: boolean;
};

export default function BreadcrumbNav() {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb: breadcrumbItem, index: number) => (
          <React.Fragment key={breadcrumb.href + index}>
            <BreadcrumbItem>
              {breadcrumb.clickable !== false ? (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}