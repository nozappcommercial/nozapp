/**
 * smoothScrollTo
 * --------------
 * Universal smooth scroll utility using Anime.js for premium feel.
 * 
 * @param targetElement The DOM element to scroll to.
 * @param duration Duration of the animation in ms (default 1200).
 * @param offset Vertical offset from the target (default 0).
 */
export async function smoothScrollTo(targetElement: HTMLElement, duration: number = 1200, offset: number = 0) {
  const anime = (await import('animejs')).default;
  
  const targetPos = Math.max(0, targetElement.offsetTop - offset);
  const currentPos = window.scrollY;

  anime({
    targets: { scrollY: currentPos },
    scrollY: targetPos,
    duration: duration,
    easing: 'easeInOutQuart',
    update: (anim) => {
      const obj = anim.animatables[0].target as unknown as { scrollY: number };
      window.scrollTo(0, obj.scrollY);
    }
  });
}
