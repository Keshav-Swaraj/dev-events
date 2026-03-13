'use server'

import Event from "@/database/event.model"
import connectDB from "../mongodb"

export const getEventBySlug = async (slug: string) => {
    try {
        await connectDB()
        const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean()
        if (!event) return null
        return JSON.parse(JSON.stringify(event))
    } catch {
        return null
    }
}

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB()

        const event = await Event.findOne({ slug })

        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean()
        return JSON.parse(JSON.stringify(similarEvents))
    } catch {
        return []
    }
}