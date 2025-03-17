A param property was accessed directly with `params.id`. `params` is now a Promise and should be unwrapped with `React.use()` before accessing properties of the underlying params object. In this version of Next.js direct access to param properties is still supported to facilitate migration but in a future version you will be required to unwrap `params` with `React.use()`.

Source
app/admin/collections/edit/[id]/page.tsx (21:21) @ id

  19 | export default function EditCollectionPage({ params }: { params: { id: string } }) {
  20 |   const router = useRouter()
> 21 |   const id = params.id
     |                     ^
  22 |   const [isLoading, setIsLoading] = useState(false)
  23 |   const [isLoadingCollection, setIsLoadingCollection] = useState(true)
  24 |   const [collectionData, setCollectionData] = useState({

    please make sure you dont write code that leads to these errors.

Do not change UI, design or components like that or simplify them, do not remove animations as well.