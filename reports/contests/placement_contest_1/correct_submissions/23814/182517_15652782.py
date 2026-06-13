def firstOccurrence(nums):
    ans = -1
    left = 0 
    right = len(nums)-1
    while(left<=right):
        mid = (left+right)//2
        if nums[mid]==1:
            ans = mid
        if nums[mid]>1:
            left = mid+1
        else:
            right = mid-1
    return ans