export interface Package {
  weight: number;
  length: number;
  width: number;
  height: number;
  unit: "metric" | "imperial";
}

export class PackageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageValidationError";
  }
}

export const validatePackage = (pkg: Package): void => {
  if (!pkg.weight || pkg.weight <= 0) {
    throw new PackageValidationError("Weight must be greater than 0");
  }
  if (!pkg.length || pkg.length <= 0) {
    throw new PackageValidationError("Length must be greater than 0");
  }
  if (!pkg.width || pkg.width <= 0) {
    throw new PackageValidationError("Width must be greater than 0");
  }
  if (!pkg.height || pkg.height <= 0) {
    throw new PackageValidationError("Height must be greater than 0");
  }
  if (!["metric", "imperial"].includes(pkg.unit)) {
    throw new PackageValidationError("Invalid dimension unit");
  }
};
