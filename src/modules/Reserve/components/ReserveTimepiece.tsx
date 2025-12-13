import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const ReserveTimepiece = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    // const [data, setData] = useState<any>(null)

    // const getData = async () => {
    //     try {
    //         const response = await WooCommerce.get('products', {
    //             params: {
    //                 tag: 23, // ID tag
    //                 per_page: 20
    //             }
    //         })

    //         console.log(response)
    //         setData(response.data)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // useEffect(() => {
    //     getData()
    // }, [])

    useGSAP(() => {
        if (!sectionRef.current || !imageContainerRef.current) return

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top'
        })
    })

    return (
        <section className='bg-grey-white relative z-10 xl:pt-[132px]' ref={sectionRef}>
            <Container className=''>
                <div className='flex flex-col items-center xl:gap-20'>
                    <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                        Reserve Your Timepieces
                    </h1>
                    <div className='relative xl:pb-[147px]'>
                        <div>{/* Carousel disini */}</div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default ReserveTimepiece
