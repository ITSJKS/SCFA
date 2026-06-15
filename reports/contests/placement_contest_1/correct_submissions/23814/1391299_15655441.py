def firstOccurrence(nums):
    n=len(nums)
    low = 0
    high = n
    while (low < high):
        mid = low + (high-low)//2
        if nums[mid]==2:
            low = mid + 1
        if nums[mid]== 1:
            high = mid 
   

    if low == n:
        return -1
    return low