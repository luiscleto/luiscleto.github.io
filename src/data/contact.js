import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';
// See https://fontawesome.com/icons?d=gallery&s=brands,regular&m=free
// to add other icons.

const data = [
  {
    link: 'https://www.linkedin.com/in/luiscleto',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://github.com/luiscleto',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://facebook.com/luiscleto93',
    label: 'Facebook',
    icon: faFacebookF,
  },
  {
    link: 'https://www.instagram.com/luisfccleto',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    link: 'https://twitter.com/luisccleto',
    label: 'Twitter',
    icon: faTwitter,
  },
  {
    link: 'mailto:luis@cleto.dev',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
