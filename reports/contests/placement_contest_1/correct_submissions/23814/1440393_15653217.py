def firstOccurrence(nums):
    ans = -1
    left = 0
    right = len(nums)-1
    while left<=right:
        if nums[left]==1:
            ans = left
        mid = left + (right-left)//2
        if nums[mid]==2: 
            left = mid+1
        else:
            if nums[mid-1]==2:
                return mid
            else:    
                right = mid -1
    return ans