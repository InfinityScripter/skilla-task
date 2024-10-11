import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getBadgeVariant = (rating: string) => {
  switch (rating) {
    case 'плохо':
      return 'bad';
    case 'хорошо':
      return 'good';
    case 'отлично':
      return 'excellent';
    default:
      return 'default';
  }
};

export const getRandomRating = () => {
  const ratings = ["плохо", "хорошо", "отлично"];
  return ratings[Math.floor(Math.random() * ratings.length)];
};
