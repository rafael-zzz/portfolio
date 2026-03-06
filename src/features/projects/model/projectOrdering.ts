interface SortableProjectLike {
  data: {
    featured: boolean;
    year: number;
    sortOrder: number;
    title: string;
  };
}

export function compareProjectEntries(
  left: SortableProjectLike,
  right: SortableProjectLike,
): number {
  if (left.data.featured !== right.data.featured) {
    return Number(right.data.featured) - Number(left.data.featured);
  }

  if (left.data.year !== right.data.year) {
    return right.data.year - left.data.year;
  }

  if (left.data.sortOrder !== right.data.sortOrder) {
    return left.data.sortOrder - right.data.sortOrder;
  }

  return left.data.title.localeCompare(right.data.title);
}
