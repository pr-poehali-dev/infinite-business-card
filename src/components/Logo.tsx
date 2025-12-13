interface LogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo = ({ variant = 'default', size = 'md', showText = true, className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-16 w-auto'
  };

  const imgSrc = variant === 'white' 
    ? 'https://cdn.poehali.dev/files/photo_5323474829841207821_y.jpg'
    : 'https://cdn.poehali.dev/files/photo_5323474829841207535_y.jpg';

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={imgSrc}
        alt="visitka.site"
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default Logo;