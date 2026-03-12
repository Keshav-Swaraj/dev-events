import BookEvent from '@/components/BookEvent';
import { getSimilarEventsBySlug } from '@/lib/actions/event.action';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IEvent } from '@/database/event.model';
import EventCard from '@/components/EventCard';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
    <div className='flex-row-gap-2 items-center'>
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
    const items = agendaItems.flatMap(item => item.split(',').map(s => s.trim()).filter(Boolean))
    return (
        <div className='agenda'>
            <h2>Agenda</h2>
            <ul>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

const EventTags = ({ tags }: { tags: string[] }) => {
    const items = tags.flatMap(item => item.split(',').map(s => s.trim()).filter(Boolean))
    return (
        <div className='flex flex-row gap-1.5 flex-wrap'>
            {items.map((tag) => (
                <div className='pill' key={tag}>{tag}</div>
            ))}
        </div>

    )
}

const EventPageDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    'use cache'
    cacheLife('hours')

    const { slug } = await params;
    const request = await fetch(`${BASE_URL}/api/events/${slug}`)
    const { event } = await request.json()
    const { _id, description, organizer, image, overview, location, date, time, mode, agenda, audience, tags } = event

    if (!description) return notFound()

    const bookings = 10

    const similarEvents : IEvent[] = await getSimilarEventsBySlug(slug)

    return (
        <section id='event'>
            <div className='header'>
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className='details'>
                <div className='content'>
                    <Image src={image} alt={overview} width={800} height={800} className='banner' />

                    <section className='flex-col-gap-2'>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className='flex-col-gap-2'>
                        <h2>Event Details</h2>

                        <EventDetailItem icon="/icons/calendar.svg" alt="Calender" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="Calender" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="Calender" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="Calender" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="Calender" label={audience} />
                    </section>

                    <EventAgenda agendaItems={agenda} />

                    <section className='flex-col-gap-2'>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>

                <aside className='booking'>
                    <div className='signup-card'>
                        <h2>Book Your Spot</h2>
                        {bookings > 0? (
                            <p className='text-sm'>
                                Join {bookings} people who have already booked their spot!
                            </p>
                        ):(
                            <p className='text-sm'>Be the first to book your spot!</p>
                        )}

                        <BookEvent eventId={_id} slug={slug} />
                    </div>
                </aside>
            </div>

            <div className='flex w-full flex-col gap-4 pt-20'>
                <h2>Similar Events</h2>
                <div className='events'>
                    {similarEvents.length>0 && similarEvents.map((similarEvent: IEvent)=>(
                        <EventCard key={similarEvent.title} {...similarEvent} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EventPageDetails