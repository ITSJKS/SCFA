def firstOccurrence(nums):
    res = -1
    left = 0
    right = len(nums)-1

    while(left <= right):
        mid = (left + right)//2
        
        if(nums[mid] == 1):
            res = mid
            right = mid-1
        
        elif(nums[mid] < 1):
            right  = mid - 1
        else:
            left = mid + 1
    
    return res