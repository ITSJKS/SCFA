def firstOccurrence(nums):
    left, right = 0, len(nums) - 1
    ans = -1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == 1:
            ans = mid
            right = mid - 1  # move left to find earlier 1
        else:  # nums[mid] == 2
            left = mid + 1
    
    return ans