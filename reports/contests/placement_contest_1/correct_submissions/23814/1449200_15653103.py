def firstOccurrence(nums):
    n = len(nums) - 1 
    start, end = 0, n 

    while start < end:
        mid = (start + end) // 2

        if nums[mid] == 2:
            start = mid + 1 
        else:
            end = mid

    if nums[start] == 1:
        return start
    return -1