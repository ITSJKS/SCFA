def firstOccurrence(nums):
    s = 0 
    e = len(nums) - 1 
    x = -1
    while s <= e : 
        mid = (s + e) // 2 
        if nums[mid] == 1 : 
            x = mid 
            e = mid - 1
        if nums[mid] == 2 : 
            s = mid + 1 

    return x