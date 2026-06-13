def isPresent(n, nums, target):
    short = 0
    end = n-1
    mid = (short + end)//2
    found = False
    while short<= end: 
        if nums[mid] ==target:
            return mid 
            found = True 
        elif target > nums[mid]:
            end = mid - 1
        else:
            short = mid + 1
        mid = (short + end)//2
    if found:
        return mid
    else:
        return -1