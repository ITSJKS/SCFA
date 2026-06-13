def firstOccurrence(nums):
    l = 0 
    r = len(nums) - 1 
    idx = -1
    while (l <= r):
        mid = (l + r) / 2
        mid = int(mid)
        if nums[mid] == 1:
            idx = mid
            r = mid - 1
        else:
            l = mid + 1
        

    
    return idx