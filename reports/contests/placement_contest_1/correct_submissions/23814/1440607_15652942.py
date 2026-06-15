def firstOccurrence(nums):
    start, end = 0, len(nums) - 1
    mid = (start + end) // 2

    if nums[0] == 1:
        return 0

    while start != end:
        if arr[mid] == 2:
            start = mid + 1
        elif arr[mid] == 1:
            end = mid
        mid = (start + end) // 2
    
    return mid if arr[mid] == 1 else -1