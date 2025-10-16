export default interface Post {
    title: string,
    description: string,
    url: string,
    createdTime: string,
    updatedTime: string,
    readingTime: number,
    category?: string[],
    tag?: string[],
}