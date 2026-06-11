import { Image } from 'expo-image'
import React from 'react'

type Props = {
    width?: number
    height?: number
}

export default function Logo({ height, width }: Props) {
    return (
        <Image source={require('../../assets/images/Logohdpi.png')} style={{ width: width, height: height }} contentFit='contain' />
    )
}
