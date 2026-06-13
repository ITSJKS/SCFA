def firstOccurrence(nums):
    target = 2
    s = 0
    e = len(nums)
    while s < e:
        mid = (s+e)//2
        if nums[mid] == target:
            s = mid + 1
        else :
            e = mid 
        if nums[mid] == 1:
            for i in range(s,mid+1):
                if nums[i] == 1:
                    return i
    return -1