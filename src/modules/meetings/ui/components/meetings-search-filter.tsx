import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMeetingsFIlters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
  const [filters, setFilters] = useMeetingsFIlters();

  return (
    <div className="relative w-52">

      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>


      <Input
        placeholder="Filter by name"
        className="h-9 w-full pl-10"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
    </div>
  );
};
