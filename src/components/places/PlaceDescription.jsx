import React, { useEffect } from 'react'
import './placesDescriptions.scss'
import { AiFillCar } from 'react-icons/ai'
import { IoArrowBackOutline } from 'react-icons/io5'
import { FaBus, FaMotorcycle, FaWalking } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPlacesAsync } from '../../redux/actions/placesActions'
import { motion } from "framer-motion";
import Carousel from 'react-multi-carousel'
import "react-multi-carousel/lib/styles.css";
import { BsCloudSun, BsFillCarFrontFill, BsSun } from 'react-icons/bs'
import { RiMotorbikeFill, RiShipLine } from 'react-icons/ri'
import { BiTime, BiWalk } from 'react-icons/bi'
import { IoMdBicycle } from 'react-icons/io'
import { WiDayRainMix } from 'react-icons/wi'
import { CiSun } from 'react-icons/ci'
import { GrMapLocation } from 'react-icons/gr'

const PlaceDescription = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { places } = useSelector(store => store.places)
  const { place } = useParams()
  console.log(places[0]);

  useEffect(() => {
    dispatch(getPlacesAsync())

  }, [])



  const placeDetails = places[0]?.find(item => item.id === place)
  console.log(placeDetails);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };


  return (
    <>

      <small className='back' onClick={() => navigate(-1)}><IoArrowBackOutline />Regresar</small>

      <motion.main className='description-main' initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}  >
        <motion.article className='description-box'>
          <Carousel style={{ justyfycontent: 'center' }}
            responsive={responsive} className='imgCarousel'
          >
            <figure>
              <img src={placeDetails?.imgAct} alt="" />

              <div className='title-description-container'>
                <p className='place-title'>{placeDetails?.name}</p>
                <p className='place-parafraph' >{placeDetails?.description}</p>
              </div>

            </figure>
            <figure>
              <img src={placeDetails?.imgPlace} alt="" />

              <div className='title-description-container'>

                <p className='place-title'>Actividades</p>
                <p className='place-parafraph' >{placeDetails?.activities}</p>
              </div>
            </figure>
            <figure>
              <img src={placeDetails?.imgPlace2} alt="" />

              <div className='icons-info' >
                <p className='place-icons' >{placeDetails?.icons.map((icon, index) => {
                  if (icon === 'car') {
                    return <BsFillCarFrontFill className='icons-tranport' key={index + 80} />

                  }
                  if (icon === 'moto') {
                    return <RiMotorbikeFill className='icons-tranport' key={index + 25} />

                  }
                  if (icon === 'walking') {
                    return <BiWalk className='icons-tranport' key={index + 38} />

                  }
                  if (icon === 'bici') {
                    return <IoMdBicycle className='icons-tranport' key={index + 18} />

                  }
                  if (icon === 'bus') {
                    return <FaBus className='icons-tranport' key={index + 10} />

                  }
                  if (icon === 'ship') {
                    return <RiShipLine className='icons-tranport' key={index + 41} />

                  }
                }

                )}
                </p>
                <p className='text-info'>
                  <GrMapLocation />
                  {placeDetails?.location}
                  -
                  {placeDetails?.department}
                </p>
                <p className='categories-container'>
                  {placeDetails?.category.map((act, index) => <small key={index}>{act}</small>)}
                </p>
                <p className='text-info'>
                  <BiTime />
                  {placeDetails?.schedules}
                </p>
                <p className='whether-icons'>
                  {placeDetails?.weather === "1" ?
                    <BsCloudSun className='icons' />
                    : placeDetails?.weather === "2" ?
                      <CiSun className='icons' />
                      : placeDetails?.weather === "3" ? <WiDayRainMix className='icons' />
                        : <BsSun className='icons' />}
                </p>
              </div>
            </figure>
          </Carousel>

        </motion.article>
      </motion.main>
    </>
  )
}

export default PlaceDescription