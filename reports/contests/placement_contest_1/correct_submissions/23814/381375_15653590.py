def firstOccurrence(nums):
    n = len(nums)
    low = 0
    hight  = n
    while low < hight:
        mid =((low + hight) // 2) 
        if nums[mid] == 2:
            low = mid + 1
        if nums[mid] == 1:
            hight = mid 
            # print()

    if low == n:
        return -1
    return low