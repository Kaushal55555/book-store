import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ArrowRight,
  Star,
  BookOpen,
  TrendingUp,
  Award,
  Heart,
  ChevronDown,
  Search,
  X,
  Eye,
  ShoppingCart,
  ChevronRight,
  Users,
  BookMarked,
  Bookmark,
  Clock,
  Check,
  ChevronUp,
  Gift,
  Truck,
  ShieldCheck,
  CreditCard,
  MailOpen,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useToast from "../components/ToastManager";
import ContactSection from "../components/ContactSection";
import BookPreview from "../components/BookPreview";

const Landing = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const featuredSliderRef = useRef(null);

  const { show, ToastContainer } = useToast();

  // Animation triggers based on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Handle header hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        // If scrolling down, hide the header
        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false);
        } else {
          // If scrolling up, show the header
          setIsHeaderVisible(true);
        }
      } else {
        // Always show header at the top of the page
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Sample testimonials
  const sampleTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Avid Reader",
      avatar: "https://thumbs.dreamstime.com/b/handsome-stylish-modern-african-american-business-man-entrepreneur-executive-sitting-outside-office-cheerful-smile-155856257.jpg",
      comment:
        "BookHaven has completely transformed my reading experience. The selection is unmatched and the recommendations are always spot on!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Book Club Organizer",
      avatar: "https://harvardtechnologyreview.com/wp-content/uploads/2023/10/image.jpeg",
      comment:
        "As someone who runs a book club, I appreciate the bulk ordering options and discussion guides. The customer service is exceptional!",
      rating: 5,
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Literature Professor",
      avatar: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEBUSEhIVFRUWFxUVFRYVFRUVFRUVFRUXFhcVFRUYHSggGBolHRUVITIhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGC0dHR0rLS0tKy0tLS0tLS0rLS0tLSstLS0tLS0tLS0tLS0rLSstLS0tKy0tLS0tLS0tLS0tLf/AABEIAQQAwgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAACAAEDBAYHBQj/xABCEAACAQIEAgcFBwIFAQkAAAABAgADEQQSITEFQQYTIlFhcYEHkaGx8BQjMkJywdFiolKCkuHxJDNDU1Rjk7LC0v/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACQRAQEAAgEEAgIDAQAAAAAAAAABAhEDBBIhMSJRQmEyQYET/9oADAMBAAIRAxEAPwD3BHEVoQE0GtHAjx4DRR49oQ1o9o9o9oDWitCtHtAG0VoVo9oAWitDtFaAForQ7RrQAtGtDtGtACKFaNaANooUaAMVo8REKG0UK0UBgI9o4Ee0BrR7R7R7QhrRwI9o4EBWitCAj2gMBHtCCwwsCMLHyyrxTi+HwwvXqpTvqAx7Rt/hQdpvQTwB0/w7NlpUq1Q33CZR7tXOn9MDU5YsszVPpU7E2pUso/N9pQgG5GUkA2JIM9JekOHvZqtNTcgjPmYEWJBAWw57kbSj0iI1oSsDqpB56EGIyALRrQ40ACINpIRBIgBaMYZEa0AbRoVo0Boo9ooCAjiPaPaA0ICICOBAVo4EcCEBAYCEBHAhKICAtqdpzTph7RyCaOCPeGrWvflakDpb+o+nfG9onSk1GbCUWtTU2rODYMRul/8ACOfedNgb85+1AHs6Dm35m/geElqnrtUZi7BmZtSWLMx/Ub3Pvlk8TrKAtNmpi4/C7XHh4C99B8ZE1UWuQGvqBYHfxO8qmqAwYcjtyI7pBJXNSxDE6/HXu9IFKqw/MQD+22kI4m9wduXyj1gLi3hptA0vBOOVaChxVItshI1a97g31FtOfunQ+iXTBMX93UAStyXlUH+JDzP9PunJsEx79CLWtrpsLgC9rjcQa9MqwYEgg6MNyRzXX942PoO0a0yHQLpZ9pXqaxArLsdBn57X3t77TZETSAIgkSS0EiUR2jWhkRiJAFo0K0aAMePGgPHijgQEBCEQEICAgIYEQENRASrMj7RukpwtIUaJ/wCoraA/+Gh0L+fIep5TVY/FpRpPVc2VFLG2+gvYePKcFxfEnxeKqYh9b3I7lX8q+7Qe+LVUqqKNN1G/9bfx9cjKjM9Rsqj0UaSV1ZnCrrchQO8nczpPRno4lKmNAWO5tPNy804478PDeSsVgei9Rh2za+1tZ6uF6FXIDet7g2nSsJw0CXlwYE8V6rOvdOkwjmx6EKF3v6G8yvHeFNQbRdPEX9Z3J6E8TjnB1qIQRylw6nLflnk6XHXhyLD1W0vfTTXx5gnzO8CvUYHcjy0nrY7BdQSp2ufd9ftPJrnXSfSl3Nvm2auqPCV2puKi6Ouq2NtbafH5TuPRHji43DLU2cdiqv8AhcAX9CCD625TgrNfzmp9nHGTh8YqlrU633bgnQNujed9PJjLLpHaCIJEkYRiJtEREEyUiARAjIg2khEEyAY0K0UBCEIhCAgICGBGAhgShAQwIyiSqIHPvbBxU08NToKbGqSzWP5F5epP9s5dgahyhF31c+Q2Hynp+0TjP2nHVCPwIerTXTKvP1JJ9Z5PCV0dzsAB7zt8piq9Hovhs2KF/wAuY/HSdX4e2gnNeh9G2Iqkn8JK/wBxnRcHiEX8TKPMgT5nVbub6nSamDQ4ZhaWJSwuJpkdlwdtj3y7mAFztOEj07QMDIa63Eh4nxqlSUnVrd1v3mXqdNc//ZYaq3kCfkJucWV9MZcuM8VS6ZcKLLmUfX18hOdPodZ06rxOq4+8wtYKeYXMR423mK4/g1N6ibG4PLK3cQdp7ODK4/HJ4efGZfKM7VfWTYaqL8/MGxB5HaVH0NjCo7/Cep430P0W4p9pwlOrftWs/wCoaH+fWetOWeyXjNqj4djowuv6l/kfITqlp0iBIgkQzBIgRkQCJKRAMALRQopAhCAjCEIDiGIwEK0oNRPO6T4/7Pg61W9iEIX9T2VT72BnoiYH2xcSKYalRH53LN4qqkW9S0X0ONVql2J7yTPR4S9gQdja/vE8uW6Ddk67ke5R/uPdMK1nAODms9QGqUS4bsWBYm4uSeWnxmgPRXDBbrVqnx1YH1C/KY7hvEHU9kZrnbWxPK/hzmnxv27MBSrdYjKpJXJTCNcFgQwJ2BAued/CeTOZd986j2YXHsnjdT4ZlonKKlxfv1HpN7w6qHo3vfSY3EYO1gWL9kXLgK4bS9suhF77iaHgdIiiBPHyzV9vbxeZ6eTxHLnsdh37CRJi6a2DPlvYAdrMbmw7KbXJFhre8u/ZiXI79jpf0vcXgYjCA4dsMUGRirFrEVM6kEP1g3bTczpx9v8AbHJ3firUONUL9iqrf03Ia3gH3kXEOHU64NSnoxFmGwcdzDv8d5FQ6Mp1RoquhIYnUtcbENbT4bme9wrhhpLlJYgC2pkzuOPnGpjMsvGUcc4/ww0W8J51FefiPr5e+dO6Z8PU03021nN6KWVj3EfMfsZ7eDk7sXh5+Ptyejw3EmhXSqt+ywJ8QNflcT6CweIFSmrjYi8+e3XQeQ+B2+M7B7N8f1uDVSbsnYP+Xb+3L7jPRi4NVaCRJIJE2iMiAZIRAMgG0UeNAQEMCMIQhDiEIgIYSVSUTjHtmxubHJSB0p0xcdzOSx+GWdrQT5w6bY3ruI4mp/6hUeVOyD4LM5EeIBDR9R9aQWESTKukdBeDCqmZhprbb9/Kb7D8EC/mPwHyE8foWoTDUx3qCfWaupjkVDefJzytyvl9rjwkwjw8bh1XQDznpcJT7s/CUMVibrmCl7cha58ReXuHcapClYizAahtD7pzkuVb3IpMlqhHcfgZ6iUvCeCOLPVc9TSDKTYszW08AAdJ6fXvTQXOaw1/2izXsxsr06dLwkGKFpHS4qGFwZRxuOubCXUW1mulb9h/0n5Tl+HqfduLam3u2/edD6Wt923kZh0wZ6vPbTW57soHu1M9vTeI+b1Pmo1bbx/fT5mbf2V8Qy4g0jtUH9y3Hx/iYw0ez7j8R9es93oI2XFIeYqAf6jl92p+E9keR28iAYZMG06MgMEw2EEyALRR4oCAhARhDWVBrJAICiSQK3E8UKVCpUY2CqST3aT5qakzq9Ur+Jib20vubHwv8RO2+1fG9Xw8qDbrHCHyszH4LMDT4aPsev8AiVDe+jBqdIjXQHLrppzmcljFPTtbx/f/AIMhZbXHl/M9fG0LMfAg+hFxKuIoWYeI+Q/giZV0TopjScLSYG9lAPpoflPUxlZ6jKg0XVmPgLae8zD+z/igR2ots2o+RH14zpGDYAFD5qZ8rnx7c6+rwZ92EQYfiFPYOGt/h1+MnY4asLVaWbXfs3nm8Swgp1OtCAhtGK3DX79N5Pw/D0agtnC/qep8bXkwwnuPVhjMp5elhsTSpjLTTKO7NKnE+kVOnYMGudgozMfJRqY+LpUA1wqvoAAqmx/1RYOg1SpnICjuA+tZu44z2znjJPaXAUS13AK3toRb4SanQAJJlmscosOcp169lM4Rj+mK6d4i1M2+u6ZBcQerXyJb/MTa3unsdO8Vdgg8/r4TMtV7I9B6C2nwn0+DHWL5vUZbzeotTsgeKj6909joWP8AqR4sh8vvU1+My9GtqL8gT9fH3zSdBj/1APdZtfBtv7gfSd3B3URxEIp0YC0AyQwDACKPFCkBJFEECSKIQSwowWPaUc+9sQPU4ccjUYHzK6fIzxeIqBh6dMCwNTPofzEFT56KPdNj7TOHmrgbqLmnUV/8tiD8xOfNjs+UMbCkhepyy5ctMhbbnMpsO9u7fnl7ajO8Y1xLD+pF0/osG9b3keIF0UjcAe4Ej9hK/E633lxubsf1MxY+sJqwyL3W/n+JBQp1Gp1My6FTp6HnOodGuNLWpg31G45g905awuSfWT8Pxz0XzobEbjkR4zjzcU5J+3bh5f8Anf07aDm8bxHg5Y9livoD85n+jfHVrIDsTuD3jQzU0MeBrefMsywun1MMplNmocGy/iZm+A90uLTsNJCeJjvlfEcSAG8W2l0kxFSeBxjiCopJMHH8WtcLqZlsW7VGJJvvbuE6YYfblnn48MtxrFGpVLH/AIEqNoff/El4gnbguLgH6vPp4+o+Zn/KgQzV+z4E4nvOXTnpccvMrMpRW5mh6HYsUsUjHQXKkg2IuCL387So79hXug90llDhlcMLjZrkW1B1P17+6X51jFKAYUYwAij2igEokqiABJBKHEkyQAJFjOIJSU3IBHI6XgLiFEPSdG2YEa/W84JxmoUdjpexBvfWxsh1vckAOeRzeZm06SdPgUKoGU6glSFNudmH8cztOZYzE9Y19AOQHd/PidfGc8q1I8+q2YkxU6h2vpCqW5QLXMyAiEdhaXuHYYf9o2w2HeYt0sm2p6HYXNQIYEG5I5Gx5iXK7YhCVDXttfui6FksGY8zp5DSaGvQGYX5z5/JlrOvo8eO8IzNLEYkna3jaXqdFiO0xM0lLhQIvf4RmwAEx3xvsrOjCk6ARNgMo1mppYEAXlPG0bmO9exyri+HtXy/4rgefL4mUV5g/wDBmk6XcOPWKF3JAHmxA+cs+0zowcHiiyKRScA3toHtZh4XOvqZ7+O7xj53JjrKslRFjLmHbI4PiD8Qf2lRKnfoe/l6ye950c3YOivFbopXVGbKBsbhfy8r30IPdppa2yoVw2n8+6cI6O8cqYdgAM6nXKdrkZbg8tPrSdP4J0youvbJBBubjv5Aj+e6amSWNawgGVMDxDr9VUhddToT4/DleXTNsgtHiigSgSRYIENRKggJ5PSPgr4imVVl15MoI9/LlPYAkimLNm9PnXpbwSthnIqpbuYaqfWZdqs+nekXCKNei/WU0Y20LW38+U4RxXohWQtanYXO5Fz5eE5WadN7ZfPfeSjTW3qe+E+CcbrIXRtrHwEgs8I4e+JrpRT8TsB5DmfdNF0t4T1OKTB0tkRc36m1N/S01/sF6N56tfFVEsKYVEJB1JuWt7l1kGEwXX4zE4hhfNWcDn2UYovwUTny5duO3Xhw7rpPwDh4pUgByE9Kslx5S6lABbQKKXuJ8zK7u305NTQcOz25S1RpXNyYC0ZNh95nbR655Sv1AllhFU0EqV53AOj32viKEjsUfvTpcAqewPHtWP8AlM2PSHhqVlanVQOvNTrbvI5keWvrt6PRvh/2bD3ItUq9pu8D8q+g+JMuDCZ959bg4+3Dy+XzZ92d0+bulPQqph71aV2o3Nr/AIl8+8eMzOFoFmCqwUk2sxsB4k8hPrfGcKptTyFQVtaxAO+85R0k9livVvQYIbAnsmxuT3cxbfn56zdjk59wzgTOTnqU8obLmDaNYi+XlbWwJtedG4b0bw9NUD13KkaJ2UXU3tdNSdjvPAqez/HUcoCZgD+Km5KgeKGx+jNT0e6LFLPVe7i5Cg3QEm99DYnx85ZCtPg8KlNAqLYDTny85JEgsIjNsGijxoFgCGoiAhCaQSyRVjU6d9PC8nw66CYuX01MftD9izb6/KQ4zhCMNR4endPYUACQqmZtdphtlW6FUKhLFANCFsOdrZtZWp9AqCVMzU1YXvrqB6bTe2les4lEHDqC06LhAFH4QALcrACc/wAVw0YWvVpAaZg48M4D28gWI9J06hh/u188/qdvdMlxrK+KrXGq5B76amefqp8Hp6a/JnRUJk+Dw2pMvGgvdDZQBpPm6fQ0rvSsLyvh9yfQSStmbTlElKwkVFUrqs0HAOBl3WpWBAHaCHuG2b4af8Qej3Aw7CtUHZU3QH8x7/IfPymuOmY+S+7/AJnu6fg38sni6jn/ABxRlc7+AlkC0bDpZYRn0HhA+0oj8THxA9wB/wDtLVarykGFF1zd5Y/EgfACQOVlavhKbG9u13jf/eW6z2HjAWnzMDya+CZdR2h4b+olMzRESpi8KG12Pf8Az3yypY8eKTHCP3RSs6TCS0qelzte0ino06VkA8z8f95MquMNSp233P1aFQGnqfnHB1j4bY+bfMznGw1G5SFcYEaxpueZZVZh5aCXbDuiVRKKb8VpkaPbe99CPQyGniqTOF61dSBa4ufLxno1PAwsILm55fOBdB0nPOJPbiGIXvFI/wBgH7ToVPacD9qfG8RheM1DRqZb0qJIIVlOjDUMPiLGc+bC546jpxZzDLdbgXhmcwT2j4lABVw9MtYH/vKZIIuDlJO4IPrJh7UKn/lU/wDdb/8AE8N6fk+ntnU8f26OwEvcD4b19TX8C7+J5LMj0A47V4nWqq1JadOkiksrFmLu1kUAgDUK/unWeE4EUaQQb7se8nedOLp73fL0xy9TLj8U6UwLADQchKrY1CSLPvqcjWuDr2rWMuVTYWEiot2R4i/v1/efQjwIX4jTB1cDz0+ciOPUg5WzfpBPylxqhAkYcmBQqVXI7NOp4XUr87GXMMMlJQdLCTZpXdsx8BAamLnMfSHUMcSPxO0KcLfykrUxbaDRUnU6CFUa5tyG8CsaEUudYIpUeMKbKoe1wfeJew1S6XH1tGwxPVgdwkJGS5X8Lf2sOXrMLEix8LsfM/MxINY2H29T8zIJjGJiBhqJpFcta8t4YWEq1d7eMs30kVZpzgHtt4fVPEWrrTY00o0c9QLdEJqOihjtqSo1759AUhpON+0Th9fFcdwuFQk0nSm9amWIpMlKsWdqi7MLWABvra28qMh004vw/H0lxeatT4gyUxWpimTQqMoCFlYnsCy3BBOwFr3MxdOplYNlDWIOVrlWsb5WAIJB2OuxnQPbbjy+OSjkqIKKEKjLSFPIxGV6DJqVbKbhvwlbDmB4ns26LniOPSmy3o07VK55ZAdEv3sdPLMeUyjtvspwF8J9reglB8SwqinTUKgpqgp0ci8lyKG11u7HmANzGVQAANANAO6CTLFRNqZHhT92vlb3aQ3qKoLMQANydBIMK3YvrYlyLgjQsSNDNAqz62Ee1hIFqqHszKGP4QSAW8gd5OykyCF2voI6rYQ6aSN6gG8sEjbayGivWNf8o+MgaoahyieiLIthyl9BYirlGkhQWFzuYlXMbn0/mG4kVVN4pITFKhqq2UWO0gz3vcXB/EP3EuMwI8559cMp7Nte/aZqpEbskX2NvMcvhHwraep+cgosb9pbXHLUG3MQsIeX1vMi6whUzBeMplQ1YayegL6yJxsZPhjy9fQwqyk417WeLNgeL4TFqCfuqyEBstwQV8tC4bXmonZFnKPbPhqf2rAV61NqlGl9oaqqoXzBRTYKQORI52G95Ucw6SdJzjsLhUrKzYqgWpmoNRWpMFyX59ZmFrc9Te5tO9+y/oqOH4FUYDrqn3lc/wBZGieSiy+dzznI/Y10YGLx5xJU/Z8M2ZA2uaoTekp78o7R13C98+hmYDc2AkgJjK9StrlUZm7tgP1Hl84AxAYFu0VAJGUEs4Av2Rvry5mYLCrj8HQWsgcviFZmomhWqilUu7r1mViVa9QKWAAy0+ZtN447S3S1xLA4+riTXz1FFLEUqdBOqJTq2VFrVipbKUAasQWFyUSxtoa9EcRd6nUVXDAl61O1AMKjV2CK5ZbAnD9W7LmBAVQLZ7iN+kPEKZqCjSqOC1eqOswuKc9psU1NFJYZQEpYcZbb1h5STiPGOLHMadJ0vnCgYcuQyCsALlSMpP2U5jvmqWNl06WX14ZScR6NYrErTaqrGpSwlIK3WUlZ8T1i1KmZgCy2anTYFStypFwDrBhuFcUUObVlqO1Km9TrqdRupSnUy9WGq6EVWBJJByk/iuwl+jxTiJr9XlqU1fEBVZ8KXRKGWuTdlAA1WiNWO5NyDpNwHpQ60sTVx1VAKGcACmULLSq1KTVA1yrBnXIqjW6+IjzIeHl4rFMnDMdTZKtCu1V3zFDT1xFdhSqBkJAIVAzWOlx3yh0d4xia9VGatcO9jROVwqk5VAe2YMq0MUzXJuVHmbNLpNjBh2zVFWqmJrK+cK6im2FFdF+7Juq1K1JLq1yF8bS7g+kWAar1iCmtZ/u8xp5X7ViA9S1iCSoBvYkgAk6TX+DY4JAtz9CG4ubn3SBKwUWY+JlOtxMTjW3qgxm2nirjXY6Ay/Sd8pz202kDlo8gzxSixSPZgNVFrHUfEeRjZ7JKBRjzmFWq1rXBPw56QlWzjxsfeAf3nnNcT0z+Q/0j+IFoiADErRQiW2kVM2se75H6+EFDC8IVbEwntb4O+KpYWilQ0zUrmkWAvo1Gq4BAIuC1NR6zcUG08tJFjfymwJVrrfkSCt/cx98qPH6KcFpcMwVOgCDlF3a1jUqtq7W8Tt3AAcpfak9XtVBlTcJzbuL+HhLFPDqDmbtt3nYeQkr1Ly+hCj6zyOmvHGw2GzUyBUqN1dNjYIrZWftM2gLBCi6G7Muk9VwIVEkc5JdXyVksP0ld8PgzUrpSSu9VauIBQELRpsQGzDLSquVBK65bMo11FKt0troqpnpP1VU0zVzMlSs1HAtinapRyDIt8qsoIIOmk3hJPjz1gWF/wruTsNzuZvun0mqxmD6VVc/VVFXEs9DDqVSqgpseprVcQ34NHKgDLex01GsucP6QUzUoUMNQp00Nc4ZgVUjqaeGrV06tkNhbINO0PvO8z363DcO5BfD0WsVe7U0PaS+RtRuLmx5XlJOBYSk4rU6K03pkshVnVczIUJKBsrHKSNRtLvH6TVeAtfCYwirVwtJesGehUzAPVphmOZitmB7AfKSQAy63uBLwngoo16mIfPUAApUsxLkWY1WdyTYkM+VdLgU99ZRxfRbrAoSu2VQUFOqudBTZjdFCkD8JK3YMT3zTdG+G9RgzQsBkBtYswzG7NZm1IuTvN30RVq1mcm3gP3/eXcJwzTM+g7pBw6si03rVCLKzeA7JIuf9Mfh3HDX7Ypt1ewY6e4TnWnqqoGwtE40kQxSXtJ2taZiqBSKSG0UqGY6CAYophQZQRJm/DT/T+8UUCYGEDFFCCEkY7R4oWJMOdfSHX5fqX/5CKKWITyJzFFAEa2Fvo6xBbRRQJkQWjFYooDAaShxI8vD5xRTc9iTBUFC3trLTD7o+OaKKWjmvE2P2s4e56uo6Zl/UwzW7r2+JmxdQqWUWA0AG2kUUlUCaz0U/DFFMormKKKaH/9k=",
      comment:
        "I regularly recommend BookHaven to my students. Their academic collection is extensive and the prices are reasonable.",
      rating: 4,
    },
  ];

  // Categories with enhanced descriptions and icons
  const categories = [
    {
      id: 1,
      name: "Fiction",
      count: "2,534",
      icon: BookOpen,
      description:
        "Immerse yourself in captivating stories, from epic fantasies to gripping thrillers.",
      color: "blue",
    },
    {
      id: 2,
      name: "Business",
      count: "1,839",
      icon: TrendingUp,
      description:
        "Discover strategies and insights from the world's most successful entrepreneurs.",
      color: "green",
    },
    {
      id: 3,
      name: "Romance",
      count: "1,573",
      icon: Heart,
      description:
        "Explore heartwarming tales of love, passion, and emotional journeys.",
      color: "red",
    },
    {
      id: 4,
      name: "Award Winners",
      count: "892",
      icon: Award,
      description:
        "Browse critically acclaimed masterpieces recognized for their excellence.",
      color: "yellow",
    },
    {
      id: 5,
      name: "Biography",
      count: "1,247",
      icon: Users,
      description:
        "Read fascinating life stories of influential figures throughout history.",
      color: "purple",
    },
    {
      id: 6,
      name: "Classics",
      count: "1,685",
      icon: BookMarked,
      description:
        "Revisit timeless literary treasures that have shaped generations.",
      color: "amber",
    },
  ];

  // Features section content
  const features = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over Rs. 500",
      icon: Truck,
      color: "blue",
    },
    {
      id: 2,
      title: "Secure Payments",
      description: "Safe & encrypted transactions",
      icon: ShieldCheck,
      color: "green",
    },
    {
      id: 3,
      title: "Easy Returns",
      description: "30-day return policy",
      icon: CreditCard,
      color: "red",
    },
    {
      id: 4,
      title: "Special Discounts",
      description: "For members & students",
      icon: Gift,
      color: "purple",
    },
  ];

  // Stats section content
  const stats = [
    { id: 1, value: "50,000+", label: "Books Available" },
    { id: 2, value: "10,000+", label: "Happy Readers" },
    { id: 3, value: "99%", label: "Satisfaction Rate" },
    { id: 4, value: "24/7", label: "Customer Support" },
  ];

  // Featured slider auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredSliderRef.current) {
        const scrollAmount = 300; // Adjust as needed
        featuredSliderRef.current.scrollLeft += scrollAmount;

        // If we reached the end, reset scroll
        if (
          featuredSliderRef.current.scrollLeft +
            featuredSliderRef.current.offsetWidth >=
          featuredSliderRef.current.scrollWidth
        ) {
          featuredSliderRef.current.scrollLeft = 0;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Fetch all books and their ratings, then sort to get top rated
  const fetchTopRatedBooks = async () => {
    try {
      setLoading(true);

      // Step 1: Get all books
      const booksResponse = await axios.get("http://localhost:8808/books");
      const allBooks = booksResponse.data.books || [];

      // Step 2: Get ratings for all books
      const booksWithRatings = await Promise.all(
        allBooks.map(async (book) => {
          try {
            // Get average rating
            const ratingResponse = await axios.get(
              `http://localhost:8808/average/${book.id}`
            );
            const averageRating = ratingResponse.data.averageRating || 0;

            // Get review count
            const reviewsResponse = await axios.get(
              `http://localhost:8808/reviews`,
              {
                params: { bookId: book.id, limit: 1 },
              }
            );
            const reviewCount = reviewsResponse.data.pagination?.total || 0;

            return {
              ...book,
              averageRating,
              reviewCount,
            };
          } catch (error) {
            console.error(`Error fetching rating for book ${book.id}:`, error);
            return {
              ...book,
              averageRating: 0,
              reviewCount: 0,
            };
          }
        })
      );

      // Step 3: Sort by rating (descending) and take top 5
      const sortedBooks = booksWithRatings
        .sort((a, b) => {
          // First sort by rating
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          // If ratings are equal, sort by review count
          return b.reviewCount - a.reviewCount;
        })
        .slice(0, 5); // Get only top 5

      setTopRatedBooks(sortedBooks);

      // Get newest books based on createdAt date
      const sortedByDate = [...booksWithRatings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      setNewArrivals(sortedByDate);
      setTestimonials(sampleTestimonials);
    } catch (err) {
      console.error("Failed to fetch books data:", err);
      show({
        message: "Failed to fetch books data",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedBooks();
  }, []);

  const handlePurchaseClick = () => {
    if (!isLoggedIn) {
      show({
        message: "Please log in to purchase books",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes("@")) {
      show({
        message: "Please enter a valid email address",
        type: "error",
        duration: 3000,
      });
      return;
    }

    show({
      message: "Thank you for subscribing to our newsletter!",
      type: "success",
      duration: 3000,
    });
    setSubscribeEmail("");
  };

  // Helper function to render stars based on rating
  const renderRatingStars = (rating) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= roundedRating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Animated Header that hides on scroll down */}
      <div
        className={`sticky top-0 z-50 transform transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </div>

      <ToastContainer />

      {/* Hero Section with Dynamic Background */}
      <section
        className="h-screen relative flex items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 animate-section"
        id="hero"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500 opacity-10"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
              class="animate-float"
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1
                className={`text-5xl md:text-6xl font-bold text-gray-900 transition-all duration-1000 ${
                  isVisible["hero"]
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-20 opacity-0"
                }`}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Discover
                </span>{" "}
                Your Next
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 ml-2">
                  Favorite
                </span>{" "}
                Book
              </h1>
              <p
                className={`text-xl text-gray-600 transition-all duration-1000 delay-200 ${
                  isVisible["hero"]
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-20 opacity-0"
                }`}
              >
                Explore our vast collection of literary treasures, from timeless
                classics to the latest bestsellers. Begin your reading journey
                today.
              </p>

              {/* Search Bar with Animated Focus Effect */}
              <div
                className={`relative transition-all duration-1000 delay-300 ${
                  isVisible["hero"]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for your next adventure..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
                  isVisible["hero"]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
              >
                <a
                  href="#featured"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                >
                  Explore Top Picks
                </a>
                <a
                  href="#categories"
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
                >
                  Browse Categories
                </a>
              </div>
            </div>

            <div
              className={`relative transform transition-all duration-1000 delay-500 ${
                isVisible["hero"]
                  ? "translate-x-0 opacity-100 rotate-0"
                  : "translate-x-20 opacity-0 rotate-12"
              }`}
            >
              {/* 3D Book Stack */}
              <div className="relative h-96 w-full">
                {[
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                  "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                  "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
                ].map((imageUrl, index) => (
                  <div
                    key={index}
                    className="absolute rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:z-10"
                    style={{
                      width: "65%",
                      height: "80%",
                      top: `${10 + index * 5}%`,
                      left: `${20 + index * 5}%`,
                      zIndex: 4 - index,
                      transform: `rotate(${index * 5}deg)`,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Featured Book ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-50 animate-pulse"></div>
                <div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200 rounded-full opacity-50 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <p className="text-blue-600 font-medium mb-2">Scroll to Explore</p>
          <ChevronDown className="h-8 w-8 text-blue-600" />
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-section"
        id="stats"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`text-center transition-all duration-700 ${
                  isVisible["stats"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <h3 className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </h3>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section with Hover Effects */}
      <section className="py-20 bg-white animate-section" id="categories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive into our carefully curated collection spanning every genre
              imaginable. From thrilling adventures to profound insights, find
              your perfect read.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer
                  transform hover:-translate-y-2 border border-gray-100 hover:border-${
                    category.color
                  }-200 ${
                  isVisible["categories"]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`bg-${category.color}-100 w-16 h-16 rounded-full flex items-center justify-center mb-6`}
                >
                  <category.icon
                    className={`h-8 w-8 text-${category.color}-600 transform group-hover:scale-110 transition-transform`}
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{category.count} Books</span>
                  <span
                    className={`text-${category.color}-600 flex items-center group-hover:font-medium transition-all`}
                  >
                    Explore{" "}
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 animate-section" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              The BookHaven Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We go beyond just selling books. Discover what makes BookHaven the
              preferred destination for book lovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`text-center transition-all duration-700 bg-white p-6 rounded-xl shadow-md hover:shadow-lg ${
                  isVisible["features"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`bg-${feature.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon
                    className={`h-8 w-8 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section with Animation */}
      <section className="py-20 bg-white animate-section" id="featured">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">Top Rated Books</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our readers' favorite picks with the highest ratings.
              Quality reads that have impressed our community.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="relative">
              {/* Auto-scrolling container */}
              <div
                ref={featuredSliderRef}
                className="flex overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {topRatedBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="min-w-[280px] md:min-w-[320px] snap-start mr-6 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 flex-shrink-0"
                  >
                    <div className="relative">
                      <img
                        src={book.imageUrl || "/api/placeholder/300/400"}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-bold">{book.title}</h3>
                          <p>{book.author}</p>
                        </div>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                        {book.averageRating?.toFixed(1) || "N/A"}
                      </div>

                      {/* Top Badge */}
                      <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                        #{index + 1} Top Rated
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm">
                        {book.author}
                      </p>

                      <div className="mb-3">
                        {renderRatingStars(book.averageRating || 0)}
                        <span className="text-xs text-gray-500 mt-1 block">
                          {book.reviewCount || 0}{" "}
                          {book.reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-blue-600 font-bold">
                          Rs. {book.price}
                        </span>
                        <button
                          className="px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm flex items-center"
                          onClick={() =>
                            (window.location.href = `/login`)
                          }
                        >
                          View Details <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section with Animated Grid */}
      <section className="py-20 bg-gray-50 animate-section" id="new-arrivals">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be the first to discover our latest additions. Fresh titles hot
              off the press!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((book, index) => (
              <div
                key={book.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden flex transition-all duration-700 transform hover:shadow-xl hover:-translate-y-1 ${
                  isVisible["new-arrivals"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-1/3">
                  <img
                    src={book.imageUrl || "/api/placeholder/200/300"}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600">New Arrival</span>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                    {book.description?.substring(0, 100) ||
                      "No description available"}
                    ...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Rs. {book.price}</span>
                    <button
                      className="text-blue-600 text-sm flex items-center hover:underline"
                      onClick={() =>
                        (window.location.href = `/login`)
                      }
                    >
                      Details <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="/books"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
            >
              View All New Arrivals <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Scroll Animation */}
      <section className="py-20 bg-white animate-section" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Readers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what the BookHaven
              community has to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-700 ${
                  isVisible["testimonials"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  {renderRatingStars(testimonial.rating)}
                </div>

                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Benefits Section */}
      <section className="py-20 bg-blue-50 animate-section" id="membership">
        <div className="container mx-auto px-4">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div
                className={`transition-all duration-700 ${
                  isVisible["membership"]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <h2 className="text-4xl font-bold mb-6">
                  Join Our Membership Program
                </h2>
                <p className="text-gray-600 mb-8">
                  Become a BookHaven member and enjoy exclusive benefits
                  designed to enhance your reading experience and save you
                  money.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        10% Discount on All Purchases
                      </h4>
                      <p className="text-gray-600">
                        Save on every book you buy, all year round.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        Early Access to New Releases
                      </h4>
                      <p className="text-gray-600">
                        Get your hands on the hottest titles before anyone else.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <Gift className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">
                        Free Shipping on Orders Over Rs. 300
                      </h4>
                      <p className="text-gray-600">
                        Lower minimum for free shipping exclusively for members.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <a
                    href="/membership"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300 inline-block"
                  >
                    Become a Member
                  </a>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div
                className={`relative transition-all duration-700 ${
                  isVisible["membership"]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <div className="bg-white p-8 rounded-xl shadow-xl relative z-10">
                  <div className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block mb-6">
                    Premium Membership
                  </div>

                  <h3 className="text-3xl font-bold mb-2">
                    Rs. 999
                    <span className="text-lg font-normal text-gray-600">
                      /year
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Unlock all benefits and elevate your reading journey
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>All standard membership benefits</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Monthly free book selection</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Exclusive author events and signings</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>Access to members-only reading group</span>
                    </li>
                  </ul>

                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
                    Join Premium
                  </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-64 h-64 bg-blue-200 rounded-full opacity-50 -z-10 transform rotate-45"></div>
                <div className="absolute bottom-6 left-6 w-40 h-40 bg-indigo-200 rounded-full opacity-50 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section with Animated Background */}
      <section
        className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 relative overflow-hidden animate-section"
        id="newsletter"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
              class="animate-float"
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className={`transition-all duration-700 ${
                isVisible["newsletter"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <MailOpen className="h-16 w-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join Our Newsletter
              </h2>
              <p className="text-blue-100 mb-8">
                Stay updated with new releases, exclusive offers, and literary
                insights. We promise we won't flood your inbox!
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col md:flex-row gap-4"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg border-2 border-transparent focus:border-blue-300 focus:outline-none"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-blue-100 text-sm mt-4">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates from BookHaven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Promotion Section */}
      <section className="py-20 bg-white animate-section" id="app">
        <div className="container mx-auto px-4">
          <div className="md:flex items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div
                className={`relative transition-all duration-700 ${
                  isVisible["app"]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                {/* Mobile App Mockup */}
                <div className="relative mx-auto w-64 h-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl transform rotate-6"></div>
                  <div className="absolute inset-0 bg-white rounded-3xl transform -rotate-3"></div>
                  <div className="relative bg-gray-900 rounded-3xl overflow-hidden border-8 border-gray-900 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?ixlib=rb-4.0.3&auto=format&fit=crop&w=280&h=560&q=80"
                      alt="BookHaven Mobile App"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Animation elements */}
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute top-1/4 -right-4 w-12 h-12 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
              </div>
            </div>

            <div className="md:w-1/2 md:pl-16">
              <div
                className={`transition-all duration-700 ${
                  isVisible["app"]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  Mobile Experience
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  Take BookHaven Wherever You Go
                </h2>
                <p className="text-gray-600 mb-8">
                  Download our mobile app and enjoy a seamless reading
                  experience on the go. Browse, purchase, and read from your
                  pocket!
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Sync your library across all devices</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Offline reading capabilities</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Personalized recommendations</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="transform transition-transform hover:scale-105"
                  >
                    <img
                      src="/api/placeholder/150/50"
                      alt="Download on App Store"
                      className="h-12"
                    />
                  </a>
                  <a
                    href="#"
                    className="transform transition-transform hover:scale-105"
                  >
                    <img
                      src="/api/placeholder/170/50"
                      alt="Get it on Google Play"
                      className="h-12"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Back to Top Button - Appears when scrolling down */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed right-6 bottom-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform ${
          lastScrollY > 500
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      {/* Book Preview Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto animate-scaleIn"
            style={{ animation: "scaleIn 0.3s ease-out forwards" }}
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="md:flex gap-8">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <img
                    src={selectedBook.imageUrl || "/api/placeholder/300/450"}
                    alt={selectedBook.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-blue-600">
                        Rs. {selectedBook.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        {renderRatingStars(selectedBook.averageRating || 0)}
                        <span className="ml-2">
                          {selectedBook.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Genre:</span>
                      <span>{selectedBook.genre || "Not specified"}</span>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() =>
                          (window.location.href = `/books/${selectedBook.id}`)
                        }
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      About the Book
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedBook.description ||
                        "No description available for this book. This is a placeholder text that would normally contain a summary of the book's content, themes, and other relevant information to help readers decide if they'd like to purchase it."}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Author</h3>
                    <p className="text-gray-600">{selectedBook.author}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">Preview</h3>
                    <div className="bg-gray-50 p-6 rounded-lg italic text-gray-600">
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Add any necessary CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Landing;
