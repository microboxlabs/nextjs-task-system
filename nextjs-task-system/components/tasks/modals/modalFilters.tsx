import { Button, Modal } from "flowbite-react";
interface props {
    filtersOpen: boolean
    setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ModalFilters({ filtersOpen, setFiltersOpen }: props) {
    return (
        <Modal show={filtersOpen} size="md" onClose={() => setFiltersOpen(false)} popup>
            <Modal.Header>Filters</Modal.Header>
            <Modal.Body>
                <p>Add your filter options here.</p>
                <Button onClick={() => setFiltersOpen(false)} color="gray">
                    Close
                </Button>
            </Modal.Body>
        </Modal>
    )
}