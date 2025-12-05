import StepCard from "@/components/dashboard/StepCard";
import { ClipboardList, FileText, Users } from "lucide-react";

const firstSvg = <svg
  width="58"
  height="48"
  viewBox="0 0 58 48"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  data-testid="options-list"
>
  <g id="Group_440">
    <rect
      id="Rectangle_796"
      width="47"
      height="14"
      rx="3"
      fill="url(#paint0_linear_9793_14638)"
    />
    <rect
      id="Rectangle_797"
      y="17"
      width="58"
      height="14"
      rx="3"
      fill="url(#paint1_linear_9793_14638)"
    />
    <rect
      id="Rectangle_798"
      y="34"
      width="47"
      height="14"
      rx="3"
      fill="url(#paint2_linear_9793_14638)"
    />
    <path
      id="Vector"
      d="M32.9067 33.5027C34.1458 34.6695 35.3353 35.7886 36.523 36.9086C36.9578 37.3186 36.9578 37.4334 36.523 37.8466C35.8993 38.4364 35.2747 39.0254 34.6492 39.6135C34.2075 40.0284 34.0901 40.0309 33.6554 39.6209C32.5581 38.5878 31.4616 37.5545 30.366 36.5208C30.2669 36.4273 30.1599 36.3404 30.0182 36.2199L28.3148 39.4225C28.114 39.8005 27.9349 40.1907 27.7062 40.5515C27.5923 40.7294 27.381 40.8524 27.214 41C27.0575 40.8426 26.8349 40.7106 26.7549 40.5244C25.7698 38.2394 24.8064 35.9502 23.836 33.6544C22.5908 30.7191 21.3445 27.7838 20.0971 24.8485C20.0547 24.7777 20.0253 24.7007 20.0101 24.6206C20.0101 24.4312 19.9641 24.1893 20.0684 24.068C20.1467 23.977 20.4492 23.986 20.6153 24.0442C21.4848 24.3468 22.3387 24.678 23.1969 25.0019C27.9473 26.7942 32.6969 28.5873 37.4456 30.3813C37.5831 30.4226 37.7141 30.4811 37.8351 30.5551C38.1142 30.7568 38.0316 31.0692 37.643 31.2537C36.2222 31.9288 34.7997 32.6 33.3754 33.2674C33.2345 33.3346 33.0989 33.4084 32.9067 33.5027Z"
      fill="#071443"
    />
    <circle id="Ellipse_166" cx="7.37199" cy="7.18644" r="3.18644" fill="white" />
    <circle id="Ellipse_167" cx="7.37199" cy="24.1864" r="3.18644" fill="white" />
    <circle id="Ellipse_168" cx="7.37199" cy="41.1864" r="3.18644" fill="white" />
  </g>

  <defs>
    <linearGradient
      id="paint0_linear_9793_14638"
      x1="5.15079"
      y1="0"
      x2="38.0319"
      y2="12.4959"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#ADACEE" />
      <stop offset="1" stopColor="#BED8FF" />
    </linearGradient>

    <linearGradient
      id="paint1_linear_9793_14638"
      x1="14.5"
      y1="17"
      x2="53.4168"
      y2="35.8772"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#BEA0FE" />
      <stop offset="1" stopColor="#BFD9FF" />
    </linearGradient>

    <linearGradient
      id="paint2_linear_9793_14638"
      x1="5.15079"
      y1="34"
      x2="38.0319"
      y2="46.4959"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#ADACEE" />
      <stop offset="1" stopColor="#BED8FF" />
    </linearGradient>
  </defs>
</svg>

const secondSvg = <svg
  width="55"
  height="59"
  viewBox="0 0 55 59"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    width="55"
    height="59"
    rx="6"
    fill="url(#paint0_linear_9793_14637)"
  />

  <path
    d="M23.7119 18.8643C23.7119 20.5686 23.2066 22.2346 22.2597 23.6517C21.3128 25.0688 19.967 26.1733 18.3924 26.8255C16.8178 27.4777 15.0852 27.6484 13.4136 27.3159C11.742 26.9834 10.2066 26.1627 9.00146 24.9576C7.79632 23.7524 6.97561 22.217 6.64312 20.5454C6.31062 18.8738 6.48127 17.1412 7.13348 15.5666C7.7857 13.992 8.89019 12.6462 10.3073 11.6993C11.7244 10.7525 13.3904 10.2471 15.0947 10.2471V18.8643H23.7119Z"
    fill="#0F2162"
  />

  <path
    d="M17.3828 7.99997C18.5145 7.99997 19.635 8.22286 20.6805 8.65592C21.726 9.08897 22.6759 9.72371 23.4761 10.5239C24.2763 11.3241 24.911 12.274 25.3441 13.3195C25.7771 14.365 26 15.4855 26 16.6172L17.3828 16.6172V7.99997Z"
    fill="#0F2162"
  />

  <rect x="5" y="38" width="45" height="16" rx="4" fill="white" />

  <rect x="9" y="43" width="34" height="1.5" rx="0.75" fill="#0F2162" />

  <rect x="9" y="48" width="23" height="1.5" rx="0.75" fill="#0F2162" />

  <defs>
    <linearGradient
      id="paint0_linear_9793_14637"
      x1="4.5"
      y1="-21.5"
      x2="36.8728"
      y2="60.2385"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0.368098" stopColor="#8AE0F3" />
      <stop offset="1" stopColor="#BCF2E5" />
    </linearGradient>
  </defs>
</svg>

const thirdSvg = <svg
  width="58"
  height="60"
  viewBox="0 0 58 60"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g id="Group 444">
    <rect
      id="Rectangle 798"
      x="8"
      y="10"
      width="50"
      height="50"
      rx="6"
      fill="url(#paint0_linear_9793_15609)"
    />
    <g
      id="Rectangle 797"
      opacity="0.6"
      style={{ mixBlendMode: "multiply" }}
    >
      <rect width="47" height="47" rx="6" fill="url(#paint1_linear_9793_15609)" />
    </g>
    <path
      id="Vector"
      d="M33.7959 21.5545C33.3388 21.0601 32.7883 20.6627 32.178 20.3867C31.5696 20.1115 30.9136 19.9661 30.2522 19.96C29.5905 19.9511 28.937 20.0781 28.3317 20.3332C27.7264 20.5883 27.1819 20.9662 26.7316 21.4436L25.9818 22.2303L25.3517 21.6271C23.3984 19.7281 20.31 19.6001 18.4773 21.3538C17.9995 21.807 17.6204 22.3553 17.3631 22.9655C17.1058 23.5756 16.9756 24.2348 16.9804 24.9031C16.9853 25.5714 17.1251 26.2348 17.3913 26.853C17.6575 27.4713 18.0446 28.0314 18.5291 28.4996L25.4867 35.2344C25.6121 35.3529 25.7572 35.4481 25.915 35.5153C26.0746 35.5782 26.2439 35.6103 26.4139 35.61C26.7593 35.6039 27.0849 35.4599 27.3193 35.2098L33.668 28.4877C35.5143 26.5685 35.5604 23.4487 33.7959 21.5545Z"
      fill="#071443"
    />
  </g>
  <defs>
    <linearGradient
      id="paint0_linear_9793_15609"
      x1="68.3266"
      y1="88.2613"
      x2="31.3698"
      y2="33.3695"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#FEE8CD" />
      <stop offset="1" stopColor="#FFDED2" />
    </linearGradient>
    <linearGradient
      id="paint1_linear_9793_15609"
      x1="66.5"
      y1="91"
      x2="7.99653"
      y2="11.7282"
      gradientUnits="userSpaceOnUse"
    >
      <stop stopColor="#EA72CB" />
      <stop offset="1" stopColor="#FFC4B1" />
    </linearGradient>
  </defs>
</svg>


const Dashboard = () => {
  return (
    <div className="px-16 py-2">
      <div className="space-y-2">
        <h1 className="text-3xl font-normal text-text-color">
          Background Information
        </h1>
        <p className="text-base font-light text-muted-foreground">
          Congratulations on your upcoming marriage! 👏🏻
        </p>
      </div>

      <div className="max-w-[800px] w-full mt-12 bg-gray-100 p-6 rounded-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-text-color mb-1">Hello Fiancé</h1>
          <p className="text-[15px] font-light text-muted-foreground">
            Welcome to your HelloPrenup dashboard! This page will help guide you
            through your prenup journey.
          </p>
        </div>

        <div className="space-y-4">
          <StepCard
            svg={firstSvg}
            title="Fill out your Questionnaire"
            description="Select your prenup terms. We guide you through state-specific processes."
            stepNumber={1}
            variant="green"
            disabled={false}
          />

          <StepCard
            svg={secondSvg}
            title="Complete your Financial Disclosure"
            description="List your assets, debts, and income to ensure a fair and valid prenup."
            stepNumber={2}
            variant="orange"
            disabled={false}
          />

          <StepCard
            svg={thirdSvg}
            title="Collaborate with your Partner"
            description="Resolve answer differences with your partner."
            stepNumber={3}
            variant="red"
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
