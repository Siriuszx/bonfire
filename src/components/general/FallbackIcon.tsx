import cn from '@/utils/cn';

type FallbackIconProps = {
  title?: string;
  style?: 'xs' | 'md' | 'lg';
  colorClass?: string;
  className?: string;
};

const FallbackIcon = ({
  title = 'N',
  style = 'md',
  colorClass = 'bg-amber-400',
  className,
}: FallbackIconProps) => {
  const capitalizedTitle = title.substring(0, 1).toUpperCase();

  return (
    <div
      className={cn(
        'flex size-10 items-center justify-center rounded-full text-2xl font-semibold text-sky-50',
        'bg-' + colorClass,
        className,
        {
          'size-6': style === 'xs',
          'size-10': style === 'md',
          'size-12': style === 'lg',
        },
      )}
    >
      {capitalizedTitle}
    </div>
  );
};

export default FallbackIcon;