import { Stack, Heading, Link, UnorderedList, ListItem, OrderedList, List, Table, Thead, Th, Tbody, Tr, Td } from '@chakra-ui/react'
import { Header } from 'components/common/Header/Header'
import { SocialMetaTags } from 'components/common/SocialMetaTags'
import React from 'react'

const PrivacyPolicies = () => {
  return (
    <div className='flex flex-col items-center w-full overflow-x-hidden'>
      <SocialMetaTags currentUrl={`https://www.openbot.chat/privacy-policies`} />
      <Header />
      <Stack spacing={10} mx='auto' maxW='3xl' my='20'>


        <Heading as='h1' size='xl'>
          PRIVACY POLICY
        </Heading>

        <p>
          Last updated July 06, 2023
        </p>

        <p>
          This privacy notice for OPENBOT LLC (doing business as Openbot) (<b>&quot;Openbot,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;</b>), describes how and why we might collect, store, use, and/or share (<b>&quot;process&quot;</b>) your information when you use our services (<b>&quot;Services&quot;</b>), such as when you:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Visit our website at <Link href='https://openbot.chat'><b>https://openbot.chat</b></Link>, or any website of ours that links to this privacy notice
          </ListItem>
          <ListItem>
            Engage with us in other related ways, including any sales, marketing, or events
          </ListItem>
          <ListItem>
            Engage with us in other related ways, including any sales, marketing, or events
          </ListItem>
        </UnorderedList>

        <p>
          <b>Questions or concerns?</b> Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at contact@openbot.chat.
        </p>


        <Heading id='SUMMARY_OF_KEY_POINTS' as='h2' size='lg'>
          SUMMARY OF KEY POINTS
        </Heading>

        <p>
          <b><i>
            This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our <Link href='#TABLE_OF_CONTENTS'>table of contents</Link> below to find the section you are looking for.
          </i></b>
        </p>

        <p>
          <b>What personal information do we process?</b> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Openbot and the Services, the choices you make, and the products and features you use. Learn more about <Link href='#Personal_information_you_disclose_to_us'>personal information you disclose to us</Link>.
        </p>

        <p>
          <b>Do we process any sensitive personal information?</b> We do not process sensitive personal information.
        </p>

        <p>
          <b>Do we receive any information from third parties?</b> We may receive information from public databases, marketing partners, social media platforms, and other outside sources. Learn more about <Link href='#Information_collected_from_other_sources'>information collected from other sources</Link>.
        </p>

        <p>
          <b>How do we process your information?</b> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <Link href='#HOW_DO_WE_PROCESS_YOUR_INFORMATION'>how we process your information</Link>.
        </p>

        <p>
          <b>In what situations and with which types of parties do we share personal information?</b> We may share information in specific situations and with specific categories of third parties. Learn more about <Link href='#WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION'>when and with whom we share your personal information</Link>.
        </p>

        <p>
          <b>How do we keep your information safe?</b> We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about <Link href='#HOW_DO_WE_KEEP_YOUR_INFORMATION_SAFE'>how we keep your information safe</Link>.
        </p>

        <p>
          <b>What are your rights?</b> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <Link href='#WHAT_ARE_YOUR_PRIVACY_RIGHTS'>your privacy rights</Link>.
        </p>

        <p>
          <b>How do you exercise your rights?</b> The easiest way to exercise your rights is by submitting a <Link href='https://app.termly.io/notify/065b88c9-c4da-4303-97b6-3c3bda88c130' target='_blank'>data subject access request</Link>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
        </p>

        <p>
          Want to learn more about what Openbot does with any information we collect? Review the privacy notice in full.
        </p>

        <Heading as='h2' size='lg'>
          TABLE OF CONTENTS
        </Heading>


        <OrderedList paddingLeft='5'>
          <ListItem>
            <Link href='#WHAT_INFORMATION_DO_WE_COLLECT'>
              WHAT INFORMATION DO WE COLLECT?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_DO_WE_PROCESS_YOUR_INFORMATION'>
              HOW DO WE PROCESS YOUR INFORMATION?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#WHAT_LEGAL_BASES_DO_WE_RELY_ON_TO_PROCESS_YOUR_PERSONAL_INFORMATION'>
              WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION'>
              WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#WHAT_IS_OUR_STANCE_ON_THIRD-PARTY_WEBSITES'>
              WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#DO_WE_USE_COOKIES_AND_OTHER_TRACKING_TECHNOLOGIES'>
              DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_DO_WE_HANDLE_YOUR_SOCIAL_LOGINS'>
              HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#IS_YOUR_INFORMATION_TRANSFERRED_INTERNATIONALLY'>
              IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_LONG_DO_WE_KEEP_YOUR_INFORMATION'>
              HOW LONG DO WE KEEP YOUR INFORMATION?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_DO_WE_KEEP_YOUR_INFORMATION_SAFE'>
              HOW DO WE KEEP YOUR INFORMATION SAFE?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#WHAT_ARE_YOUR_PRIVACY_RIGHTS'>
              WHAT ARE YOUR PRIVACY RIGHTS?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#CONTROLS_FOR_DO-NOT-TRACK_FEATURES'>
              CONTROLS FOR DO-NOT-TRACK FEATURES
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#DO_CALIFORNIA_RESIDENTS_HAVE_SPECIFIC_PRIVACY_RIGHTS'>
              DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#DO_VIRGINIA_RESIDENTS_HAVE_SPECIFIC_PRIVACY_RIGHTS'>
              DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#DO_WE_MAKE_UPDATES_TO_THIS_NOTICE'>
              DO WE MAKE UPDATES TO THIS NOTICE?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_CAN_YOU_CONTACT_US_ABOUT_THIS_NOTICE'>
              HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_CAN_YOU_REVIEW_UPDATE_OR_DELETE_THE_DATA_WE_COLLECT_FROM_YOU'>
              HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
            </Link>
          </ListItem>
        </OrderedList>

        <Heading id='WHAT_INFORMATION_DO_WE_COLLECT' as='h2' size='lg'>
          1. WHAT INFORMATION DO WE COLLECT?
        </Heading>

        <Heading id='Personal_information_you_disclose_to_us' as='h3' size='md'>
          Personal information you disclose to us
        </Heading>

        <p>
          <i><b>In Short: </b>We collect personal information that you provide to us.</i>
        </p>

        <p>
          We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
        </p>

        <p>
          <b>Personal Information Provided by You.</b> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            names
          </ListItem>
          <ListItem>
            phone numbers
          </ListItem>
          <ListItem>
            email addresses
          </ListItem>
          <ListItem>
            mailing addresses
          </ListItem>
          <ListItem>
            job titles
          </ListItem>
          <ListItem>
            usernames
          </ListItem>
          <ListItem>
            passwords
          </ListItem>
          <ListItem>
            contact preferences
          </ListItem>
          <ListItem>
            contact or authentication data
          </ListItem>
          <ListItem>
            billing addresses
          </ListItem>
          <ListItem>
            debit/credit card numbers
          </ListItem>
        </UnorderedList>

        <p>
          <b>Sensitive Information.</b> We do not process sensitive information.
        </p>

        <p>
          <b>Payment Data.</b> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: <Link href='https://support.stripe.com/topics/privacy' target='_blank'>https://support.stripe.com/topics/privacy</Link>.
        </p>

        <p>
          <b>Social Media Login Data.</b> We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called <Link href='#HOW_DO_WE_HANDLE_YOUR_SOCIAL_LOGINS'>&quot;HOW DO WE HANDLE YOUR SOCIAL LOGINS?&quot;</Link> below.
        </p>

        <p>
          All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
        </p>

        <Heading id='Information_automatically_collected' as='h3' size='md'>
          Information automatically collected
        </Heading>

        <p>
          <i><b>In Short:</b> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</i>
        </p>

        <p>
          We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
        </p>

        <p>
          Like many businesses, we also collect information through cookies and similar technologies.
        </p>

        <p>
          The information we collect includes:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Log and Usage Data. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called &quot;crash dumps&quot;), and hardware settings).
          </ListItem>
          <ListItem>
            Device Data. We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.
          </ListItem>
          <ListItem>
            Location Data. We collect location data such as information about your device&apos;s location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
          </ListItem>
        </UnorderedList>

        <Heading id='Information_collected_from_other_sources' as='h3' size='md'>
          Information collected from other sources
        </Heading>

        <p>
          <i><b>In Short:</b> We may collect limited data from public databases, marketing partners, social media platforms, and other outside sources.</i>
        </p>

        <p>
          In order to enhance our ability to provide relevant marketing, offers, and services to you and update our records, we may obtain information about you from other sources, such as public databases, joint marketing partners, affiliate programs, data providers, social media platforms, and from other third parties. This information includes mailing addresses, job titles, email addresses, phone numbers, intent data (or user behavior data), Internet Protocol (IP) addresses, social media profiles, social media URLs, and custom profiles, for purposes of targeted advertising and event promotion. If you interact with us on a social media platform using your social media account (e.g. , Facebook or Twitter), we receive personal information about you such as your name, email address, and gender. Any personal information that we collect from your social media account depends on your social media account&quot;s privacy settings.
        </p>

        <Heading id='HOW_DO_WE_PROCESS_YOUR_INFORMATION' as='h2' size='lg'>
          2. HOW DO WE PROCESS YOUR INFORMATION?
        </Heading>

        <p>
          <i><b>In Short:</b> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</i>
        </p>

        <p>
          <b>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</b>
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            <b>To facilitate account creation and authentication and otherwise manage user accounts.</b> We may process your information so you can create and log in to your account, as well as keep your account in working order.
          </ListItem>
          <ListItem>
            <b>To deliver and facilitate delivery of services to the user.</b> We may process your information to provide you with the requested service.
          </ListItem>
          <ListItem>
            <b>To respond to user inquiries/offer support to users.</b> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.
          </ListItem>
          <ListItem>
            <b>To send administrative information to you.</b> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.
          </ListItem>
          <ListItem>
            <b>To fulfill and manage your orders.</b> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.
          </ListItem>
          <ListItem>
            <b>To enable user-to-user communications.</b> We may process your information if you choose to use any of our offerings that allow for communication with another user.
          </ListItem>
          <ListItem>
            <b>To request feedback.</b> We may process your information when necessary to request feedback and to contact you about your use of our Services.
          </ListItem>
          <ListItem>
            <b>To send you marketing and promotional communications.</b> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see <Link href='#WHAT_ARE_YOUR_PRIVACY_RIGHTS'>&quot;WHAT ARE YOUR PRIVACY RIGHTS?&quot;</Link> below.
          </ListItem>
          <ListItem>
            <b>To deliver targeted advertising to you.</b> We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.
          </ListItem>
          <ListItem>
            <b>To protect our Services.</b> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.
          </ListItem>
          <ListItem>
            <b>To identify usage trends.</b> We may process information about how you use our Services to better understand how they are being used so we can improve them.
          </ListItem>
          <ListItem>
            <b>To determine the effectiveness of our marketing and promotional campaigns.</b> We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.
          </ListItem>
          <ListItem>
            <b>To save or protect an individual&quot;s vital interest.</b> We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.
          </ListItem>
        </UnorderedList>

        <Heading id='WHAT_LEGAL_BASES_DO_WE_RELY_ON_TO_PROCESS_YOUR_PERSONAL_INFORMATION' as='h2' size='lg'>
          3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?
        </Heading>

        <p>
          <i><b>In Short:</b> We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</i>
        </p>

        <p>
          <u><b><i>If you are located in the EU or UK, this section applies to you.</i></b></u>
        </p>

        <p>
          The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            <b>Consent.</b> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about <Link href='#withdrawing_your_consent'>withdrawing your consent</Link>.
          </ListItem>
          <ListItem>
            <b>Performance of a Contract.</b> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.
          </ListItem>
          <ListItem>
            <b>Legitimate Interests.</b> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:
            <UnorderedList paddingLeft='5'>
              <ListItem>
                Send users information about special offers and discounts on our products and services
              </ListItem>
              <ListItem>
                Develop and display personalized and relevant advertising content for our users
              </ListItem>
              <ListItem>
                Analyze how our Services are used so we can improve them to engage and retain users
              </ListItem>
              <ListItem>
                Support our marketing activities
              </ListItem>
              <ListItem>
                Diagnose problems and/or prevent fraudulent activities
              </ListItem>
              <ListItem>
                Understand how our users use our products and services so we can improve user experience
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <b>Legal Obligations.</b> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.
          </ListItem>
          <ListItem>
            <b>Vital Interests.</b> We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.
          </ListItem>
        </UnorderedList>

        <p>
          <u><b><i>If you are located in Canada, this section applies to you.</i></b></u>
        </p>

        <p>
          We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can <Link href='#withdraw_your_consent'>withdraw your consent</Link> at any time.
        </p>

        <p>
          In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way
          </ListItem>
          <ListItem>
            For investigations and fraud detection and prevention
          </ListItem>
          <ListItem>
            For business transactions provided certain conditions are met
          </ListItem>
          <ListItem>
            If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim
          </ListItem>
          <ListItem>
            For identifying injured, ill, or deceased persons and communicating with next of kin
          </ListItem>
          <ListItem>
            If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse
          </ListItem>
          <ListItem>
            If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province
          </ListItem>
          <ListItem>
            If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records
          </ListItem>
          <ListItem>
            If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced
          </ListItem>
          <ListItem>
            If the collection is solely for journalistic, artistic, or literary purposes
          </ListItem>
          <ListItem>
            If the information is publicly available and is specified by the regulations
          </ListItem>
        </UnorderedList>

        <Heading id='WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION' as='h2' size='lg'>
          4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </Heading>

        <p>
          <i><b>In Short:</b> We may share information in specific situations described in this section and/or with the following categories of third parties.</i>
        </p>

        <p>
          <b>Vendors, Consultants, and Other Third-Party Service Providers.</b> We may share your data with third-party vendors, service providers, contractors, or agents (&quot;third parties&quot;) who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organization apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct. The categories of third parties we may share personal information with are as follows:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Ad Networks
          </ListItem>
          <ListItem>
            Affiliate Marketing Programs
          </ListItem>
          <ListItem>
            Cloud Computing Services
          </ListItem>
          <ListItem>
            Communication & Collaboration Tools
          </ListItem>
          <ListItem>
            Data Analytics Services
          </ListItem>
          <ListItem>
            Data Storage Service Providers
          </ListItem>
          <ListItem>
            Payment Processors
          </ListItem>
          <ListItem>
            Sales & Marketing Tools
          </ListItem>
          <ListItem>
            Social Networks
          </ListItem>
          <ListItem>
            Testing Tools
          </ListItem>
          <ListItem>
            User Account Registration & Authentication Services
          </ListItem>
          <ListItem>
            Website Hosting Service Providers
          </ListItem>
          <ListItem>
            Retargeting Platforms
          </ListItem>
          <ListItem>
            Finance & Accounting Tools
          </ListItem>
          <ListItem>
            Government Entities
          </ListItem>
          <ListItem>
            Order Fulfillment Service Providers
          </ListItem>
          <ListItem>
            Performance Monitoring Tools
          </ListItem>
          <ListItem>
            Product Engineering & Design Tools
          </ListItem>
        </UnorderedList>

        <p>
          We also may need to share your personal information in the following situations:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            <b>Business Transfers.</b> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </ListItem>
          <ListItem>
            <b>When we use Google Maps Platform APIs.</b> We may share your information with certain Google Maps Platform APIs (e.g., Google Maps API, Places API). We obtain and store on your device (&quot;cache&quot;) your location. You may revoke your consent anytime by contacting us at the contact details provided at the end of this document.
          </ListItem>
          <ListItem>
            <b>Affiliates.</b> We may share your information with our affiliates, in which case we will require those affiliates to honor this privacy notice. Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.
          </ListItem>
          <ListItem>
            <b>Business Partners.</b> We may share your information with our business partners to offer you certain products, services, or promotions.
          </ListItem>
          <ListItem>
            <b>Other Users.</b> When you share personal information (for example, by posting comments, contributions, or other content to the Services) or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity. If you interact with other users of our Services and register for our Services through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity. Similarly, other users will be able to view descriptions of your activity, communicate with you within our Services, and view your profile.
          </ListItem>
        </UnorderedList>

        <Heading id='WHAT_IS_OUR_STANCE_ON_THIRD-PARTY_WEBSITES' as='h2' size='lg'>
          5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?
        </Heading>

        <p>
          <i><b>In Short:</b> We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</i>
        </p>

        <p>
          The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.
        </p>

        <Heading id='DO_WE_USE_COOKIES_AND_OTHER_TRACKING_TECHNOLOGIES' as='h2' size='lg'>
          6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
        </Heading>

        <p>
          <i><b>In Short:</b> We may use cookies and other tracking technologies to collect and store your information.</i>
        </p>

        <p>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
        </p>

        <Heading id='HOW_DO_WE_HANDLE_YOUR_SOCIAL_LOGINS' as='h2' size='lg'>
          7. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
        </Heading>

        <p>
          <i><b>In Short:</b> If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</i>
        </p>

        <p>
          Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
        </p>

        <p>
          We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
        </p>

        <Heading id='IS_YOUR_INFORMATION_TRANSFERRED_INTERNATIONALLY' as='h2' size='lg'>
          8. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
        </Heading>

        <p>
          <i><b>In Short:</b> We may transfer, store, and process your information in countries other than your own.</i>
        </p>

        <p>
          Our servers are located in the United States. If you are accessing our Services from outside the United States, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information (see <Link href='#WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION'>&quot;WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?&quot;</Link> above), in the United States, and other countries.
        </p>

        <p>
          If you are a resident in the European Economic Area (EEA) or United Kingdom (UK), then these countries may not necessarily have data protection laws or other similar laws as comprehensive as those in your country. However, we will take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law.
        </p>

        <p>
          European Commission&quot;s Standard Contractual Clauses:
        </p>

        <p>
          We have implemented measures to protect your personal information, including by using the European Commission&quot;s Standard Contractual Clauses for transfers of personal information between our group companies and between us and our third-party providers. These clauses require all recipients to protect all personal information that they process originating from the EEA or UK in accordance with European data protection laws and regulations. Our Standard Contractual Clauses can be provided upon request. We have implemented similar appropriate safeguards with our third-party service providers and partners and further details can be provided upon request.
        </p>

        <Heading id='HOW_LONG_DO_WE_KEEP_YOUR_INFORMATION' as='h2' size='lg'>
          9. HOW LONG DO WE KEEP YOUR INFORMATION?
        </Heading>

        <p>
          <i><b>In Short:</b> We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.</i>
        </p>

        <p>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
        </p>

        <p>
          When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
        </p>

        <Heading id='HOW_DO_WE_KEEP_YOUR_INFORMATION_SAFE' as='h2' size='lg'>
          10. HOW DO WE KEEP YOUR INFORMATION SAFE?
        </Heading>

        <p>
          <i><b>In Short:</b> We aim to protect your personal information through a system of organizational and technical security measures.</i>
        </p>

        <p>
          We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
        </p>

        <Heading id='WHAT_ARE_YOUR_PRIVACY_RIGHTS' as='h2' size='lg'>
          11. WHAT ARE YOUR PRIVACY RIGHTS?
        </Heading>

        <p>
          <i><b>In Short:</b> In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</i>
        </p>

        <p>
          In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section <Link href='#HOW_CAN_YOU_CONTACT_US_ABOUT_THIS_NOTICE?'>&quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot;</Link> below.
        </p>

        <p>
          We will consider and act upon any request in accordance with applicable data protection laws.
        </p>

        <p>
          If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your <Link href='https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm' target='_blank'>Member State data protection authority</Link> or <Link href='https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/' target='_blank'>UK data protection authority</Link>.
        </p>

        <p>
          If you are located in Switzerland, you may contact the <Link href='https://www.edoeb.admin.ch/edoeb/en/home.html' target='_blank'>Federal Data Protection and Information Commissioner</Link>.
        </p>

        <p>
          <u><b id='withdrawing_your_consent'>Withdrawing your consent:</b></u> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section <Link href='#HOW_CAN_YOU_CONTACT_US_ABOUT_THIS_NOTICE'>&quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot;</Link> below or updating your preferences.
        </p>

        <p>
          However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
        </p>

        <p>
          <u><b id='opting_out_of_marketing_and_promotional_communications'>Opting out of marketing and promotional communications:</b></u> You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section <Link href='#HOW_CAN_YOU_CONTACT_US_ABOUT_THIS_NOTICE'>&quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot;</Link> below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.
        </p>

        <Heading as='h3' size='md'>
          Account Information
        </Heading>

        <p>
          If you would at any time like to review or change the information in your account or terminate your account, you can:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Log in to your account settings and update your user account.
          </ListItem>
        </UnorderedList>

        <p>
          Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
        </p>

        <p>
          <u><b id='cookies_and_similar_technologies'>Cookies and similar technologies:</b></u> Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. You may also <Link href='http://www.aboutads.info/choices/' target='_blank'>opt out of interest-based advertising by advertisers</Link> on our Services.
        </p>

        <p>
          If you have questions or comments about your privacy rights, you may email us at contact@openbot.chat.
        </p>

        <Heading id='CONTROLS_FOR_DO-NOT-TRACK_FEATURES' as='h2' size='lg'>
          12. CONTROLS FOR DO-NOT-TRACK FEATURES
        </Heading>

        <p>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (&quot;DNT&quot;) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice.
        </p>

        <Heading id='DO_CALIFORNIA_RESIDENTS_HAVE_SPECIFIC_PRIVACY_RIGHTS' as='h2' size='lg'>
          13. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </Heading>

        <p>
          <i><b>In Short:</b> Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information.</i>
        </p>

        <p>
          California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
        </p>

        <p>
          If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.).
        </p>

        <Heading as='h3' size='md'>
          CCPA Privacy Notice
        </Heading>

        <p>
          The California Code of Regulations defines a &quot;resident&quot; as:
        </p>

        <List paddingLeft='5'>
          <ListItem>
            (1) every individual who is in the State of California for other than a temporary or transitory purpose and
          </ListItem>
          <ListItem>
            (2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose
          </ListItem>
        </List>

        <p>
          All other individuals are defined as &quot;non-residents.&quot;
        </p>

        <p>
          If this definition of &quot;resident&quot; applies to you, we must adhere to certain rights and obligations regarding your personal information.
        </p>

        <p>
          <b>What categories of personal information do we collect?</b>
        </p>

        <p>
          We have collected the following categories of personal information in the past twelve (12) months:
        </p>

        <Table>
          <Thead>
            <Th fontWeight='bold'>
              Category
            </Th>
            <Th fontWeight='bold'>
              Examples
            </Th>
            <Th fontWeight='bold'>
              Collected
            </Th>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                A. Identifiers
              </Td>
              <Td>
                Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                B. Personal information categories listed in the California Customer Records statute
              </Td>
              <Td>
                Name, contact information, education, employment, employment history, and financial information
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                C. Protected classification characteristics under California or federal law
              </Td>
              <Td>
                Gender and date of birth
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                D. Commercial information
              </Td>
              <Td>
                Transaction information, purchase history, financial details, and payment information
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                E. Biometric information
              </Td>
              <Td>
                Fingerprints and voiceprints
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                F. Internet or other similar network activity
              </Td>
              <Td>
                Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                G. Geolocation data
              </Td>
              <Td>
                Device location
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                H. Audio, electronic, visual, thermal, olfactory, or similar information
              </Td>
              <Td>
                Images and audio, video or call recordings created in connection with our business activities
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                I. Professional or employment-related information
              </Td>
              <Td>
                Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us
              </Td>
              <Td>YES</Td>
            </Tr>
            <Tr>
              <Td>
                J. Education Information
              </Td>
              <Td>
                Student records and directory information
              </Td>
              <Td>
                YES
              </Td>
            </Tr>
            <Tr>
              <Td>
                K. Inferences drawn from other personal information
              </Td>
              <Td>
                Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics
              </Td>
              <Td>
                NO
              </Td>
            </Tr>
            <Tr>
              <Td>
                L. Sensitive Personal Information
              </Td>
              <Td></Td>
              <Td>
                No
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <p>
          We will use and retain the collected personal information as needed to provide the Services or for:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Category A - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category B - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category C - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category D - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category E - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category F - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category G - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category H - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category I - As long as the user has an account with us
          </ListItem>
          <ListItem>
            Category J - As long as the user has an account with us
          </ListItem>
        </UnorderedList>

        <p>
          We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Receiving help through our customer support channels;
          </ListItem>
          <ListItem>
            Category B - As long as the user has an account with us
            Participation in customer surveys or contests; and
          </ListItem>
          <ListItem>
            Facilitation in the delivery of our Services and to respond to your inquiries.
          </ListItem>
        </UnorderedList>

        <p>
          <b>How do we use and share your personal information?</b>
        </p>

        <p>
          OPENBOT LLC collects and shares your personal information through:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Targeting cookies/Marketing cookies
          </ListItem>
          <ListItem>
            Social media cookies
          </ListItem>
          <ListItem>
            Beacons/Pixels/Tags
          </ListItem>
          <ListItem>
            Social media plugins: Facebook and Twitter. We use social media features, such as a &quot;Like&quot; button, and widgets, such as a &quot;Share&quot; button, in our Services. Such features may process your Internet Protocol (IP) address and track which page you are visiting on our website. We may place a cookie to enable the feature to work correctly. If you are logged in on a certain social media platform and you interact with a widget or button belonging to that social media platform, this information may be recorded to your profile of such social media platform. To avoid this, you should log out from that social media platform before accessing or using the Services. Social media features and widgets may be hosted by a third party or hosted directly on our Services. Your interactions with these features are governed by the privacy notices of the companies that provide them. By clicking on one of these buttons, you agree to the use of this plugin and consequently the transfer of personal information to the corresponding social media service. We have no control over the essence and extent of these transmitted data or their additional processing.
          </ListItem>
        </UnorderedList>

        <p>
          More information about our data collection and sharing practices can be found in this privacy notice.
        </p>

        <p>
          You can opt out from the selling or sharing of your personal information by disabling cookies in Cookie Preference Settings and clicking on the Do Not Sell or Share My Personal Information link on our homepage.
        </p>

        <p>
          You may contact us by email at contact@openbot.chat, or by referring to the contact details at the bottom of this document.
        </p>

        <p>
          If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
        </p>

        <p>
          <b>Will your information be shared with anyone else?</b>
        </p>

        <p>
          We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf, following the same strict privacy protection obligations mandated by the CCPA.
        </p>

        <p>
          We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be &quot;selling&quot; of your personal information.
        </p>

        <p>
          OPENBOT LLC has disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:
        </p>

        <p>
          The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under <Link href='WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION'>&quot;WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?&quot;</Link>.
        </p>

        <p>
          OPENBOT LLC has sold or shared the following categories of personal information to third parties in the preceding twelve (12) months:
        </p>

        <p>
          The categories of third parties to whom we sold personal information are:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Ad Networks
          </ListItem>
          <ListItem>
            Affiliate Marketing Programs
          </ListItem>
          <ListItem>
            Data Analytics Services
          </ListItem>
          <ListItem>
            Retargeting Platforms
          </ListItem>
          <ListItem>
            Social Networks
          </ListItem>
          <ListItem>
            Retargeting Platforms
          </ListItem>
          <ListItem>
            User Account Registration & Authentication Services
          </ListItem>
        </UnorderedList>

        <p>
          The categories of third parties to whom we shared personal information with are:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Social Networks
          </ListItem>
          <ListItem>
            Retargeting Platforms
          </ListItem>
          <ListItem>
            Data Analytics Services
          </ListItem>
          <ListItem>
            Affiliate Marketing Programs
          </ListItem>
          <ListItem>
            Ad Networks
          </ListItem>
        </UnorderedList>

        <p>
          <b>Your rights with respect to your personal data</b>
        </p>

        <p>
          <u>Right to request deletion of the data — Request to delete</u>
        </p>

        <p>
          You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities.
        </p>

        <p>
          <u>Right to be informed — Request to know</u>
        </p>

        <p>
          Depending on the circumstances, you have a right to know:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            whether we collect and use your personal information;
          </ListItem>
          <ListItem>
            the categories of personal information that we collect;
          </ListItem>
          <ListItem>
            the purposes for which the collected personal information is used;
          </ListItem>
          <ListItem>
            whether we sell or share personal information to third parties;
          </ListItem>
          <ListItem>
            the categories of personal information that we sold, shared, or disclosed for a business purpose;
          </ListItem>
          <ListItem>
            the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;
          </ListItem>
          <ListItem>
            the business or commercial purpose for collecting, selling, or sharing personal information; and
          </ListItem>
          <ListItem>
            the specific pieces of personal information we collected about you.
          </ListItem>
        </UnorderedList>

        <p>
          In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request.
        </p>

        <p>
          <u>Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights</u>
        </p>

        <p>
          We will not discriminate against you if you exercise your privacy rights.
        </p>

        <p>
          <u>Right to Limit Use and Disclosure of Sensitive Personal Information</u>
        </p>

        <p>
          We do not process consumer&quot;s sensitive personal information.
        </p>

        <p>
          <u>Verification process</u>
        </p>

        <p>
          Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate.
        </p>

        <p>
          We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you.
        </p>

        <p>
          <u>Other privacy rights</u>
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            You may object to the processing of your personal information.
          </ListItem>
          <ListItem>
            You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information.
          </ListItem>
          <ListItem>
            You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA.
          </ListItem>
        </UnorderedList>

        <p>
          To exercise these rights, you can contact us by email at contact@openbot.chat, or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you.
        </p>

        <Heading id='DO_VIRGINIA_RESIDENTS_HAVE_SPECIFIC_PRIVACY_RIGHTS' as='h2' size='lg'>
          14. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
        </Heading>

        <p>
          <i><b>In Short:</b> Yes, if you are a resident of Virginia, you may be granted specific rights regarding access to and use of your personal information.</i>
        </p>

        <Heading as='h3' size='md'>
          Virginia CDPA Privacy Notice
        </Heading>

        <p>
          Under the Virginia Consumer Data Protection Act (CDPA):
        </p>

        <p>
          &quot;Consumer&quot; means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context.
        </p>

        <p>
          &quot;Personal data&quot; means any information that is linked or reasonably linkable to an identified or identifiable natural person. &quot;Personal data&quot; does not include de-identified data or publicly available information.
        </p>

        <p>
          &quot;Sale of personal data&quot; means the exchange of personal data for monetary consideration.
        </p>

        <p>
          If this definition &quot;consumer&quot; applies to you, we must adhere to certain rights and obligations regarding your personal data.
        </p>

        <p>
          The information we collect, use, and disclose about you will vary depending on how you interact with OPENBOT LLC and our Services. To find out more, please visit the following links:
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            <Link href='#WHAT_INFORMATION_DO_WE_COLLECT'>
              Personal data we collect
            </Link>
          </ListItem>
          <ListItem>
            <Link href='#HOW_DO_WE_PROCESS_YOUR_INFORMATION'>
              How we use your personal data
            </Link>
          </ListItem>
          <ListItem >
            <Link href='#WHEN_AND_WITH_WHOM_DO_WE_SHARE_YOUR_PERSONAL_INFORMATION'>
              When and with whom we share your personal data
            </Link>
          </ListItem>
        </UnorderedList>

        <p>
          <u>Your rights with respect to your personal data</u>
        </p>

        <UnorderedList paddingLeft='5'>
          <ListItem>
            Right to be informed whether or not we are processing your personal data
          </ListItem>
          <ListItem>
            Right to access your personal data
          </ListItem>
          <ListItem >
            Right to correct inaccuracies in your personal data
          </ListItem>
          <ListItem >
            Right to request deletion of your personal data
          </ListItem>
          <ListItem >
            Right to obtain a copy of the personal data you previously shared with us
          </ListItem>
          <ListItem >
            Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (&quot;profiling&quot;)
          </ListItem>
        </UnorderedList>

        <p>
          OPENBOT LLC sells personal data to third parties or processes personal data for targeted advertising. Please see the following section to find out how you can opt out from further selling or sharing of your personal data for targeted advertising or profiling purposes.
        </p>

        <p>
          <u>Exercise your rights provided under the Virginia CDPA</u>
        </p>

        <p>
          More information about our data collection and sharing practices can be found in this privacy notice.
        </p>

        <p>
          You can opt out from the selling of your personal data, targeted advertising, or profiling by disabling cookies in Cookie Preference Settings. You may contact us by email at contact@openbot.chat, by submitting a <Link href='https://app.termly.io/notify/065b88c9-c4da-4303-97b6-3c3bda88c130' target='_blank'>data subject access request</Link>, or by referring to the contact details at the bottom of this document.
        </p>

        <p>
          If you are using an authorized agent to exercise your rights, we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf.
        </p>

        <p>
          <u>Verification process</u>
        </p>

        <p>
          We may request that you provide additional information reasonably necessary to verify you and your consumer&quot;s request. If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request.
        </p>

        <p>
          Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension.
        </p>

        <p>
          <u>Right to appeal</u>
        </p>

        <p>
          If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at contact@openbot.chat. Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal if denied, you may contact the <Link href='https://www.oag.state.va.us/consumer-protection/index.php/file-a-complaint' target='_blank'>Attorney General to submit a complaint</Link>.
        </p>

        <Heading id='DO_WE_MAKE_UPDATES_TO_THIS_NOTICE' as='h2' size='lg'>
          15. DO WE MAKE UPDATES TO THIS NOTICE?
        </Heading>

        <p>
          <i><b>In Short:</b> Yes, we will update this notice as necessary to stay compliant with relevant laws.</i>
        </p>

        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
        </p>

        <Heading id='HOW_CAN_YOU_CONTACT_US_ABOUT_THIS_NOTICE' as='h2' size='lg'>
          16. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </Heading>

        <p>
          If you have questions or comments about this notice, you may email us at contact@openbot.chat or contact us by post at:
        </p>

        <List paddingLeft='5'>
          <ListItem>
            OPENBOT LLC
          </ListItem>
          <ListItem>
            1401 21ST ST STE R
          </ListItem>
          <ListItem >
            SACRAMENTO, CA 95811
          </ListItem>
          <ListItem >
            United States
          </ListItem>
        </List>

        <Heading id='HOW_CAN_YOU_REVIEW_UPDATE_OR_DELETE_THE_DATA_WE_COLLECT_FROM_YOU' as='h2' size='lg'>
          17. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
        </Heading>

        <p>
          Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please fill out and submit a <Link href='https://app.termly.io/notify/065b88c9-c4da-4303-97b6-3c3bda88c130' target=''>data subject access request</Link>.
        </p>
      </Stack>
    </div>
  )
}

export default PrivacyPolicies
