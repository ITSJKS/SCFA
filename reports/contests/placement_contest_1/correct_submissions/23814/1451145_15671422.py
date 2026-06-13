def firstOccurrence(nums):
    n = len(nums)
    left, right = 0, len(nums) - 1
    ind = -1
    
    while left <= right:
        mid = left + (right - left)//2
        if nums[mid] == 1:
            ind = mid
            right = mid - 1
        elif nums[mid] > 1:
            left = mid + 1
        else:
            right = mid - 1
    return ind