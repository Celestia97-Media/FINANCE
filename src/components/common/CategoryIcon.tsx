import React from 'react';
import {
  MapPin,
  Camera,
  Users,
  Sparkles,
  Scissors,
  Palette,
  Truck,
  Coffee,
  Car,
  Utensils,
  Clock,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'PlusCircle':
      return <PlusCircle className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
