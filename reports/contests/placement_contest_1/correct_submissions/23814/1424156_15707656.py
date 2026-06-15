def firstOccurrence(nums):
    left, right = 0, len(nums)

    while left<right:
        mid = (left + right -1)//2
        if nums[mid] == 1:
            if mid > left and nums[mid-1] == 1:
                right= mid
            else:
                return mid
        else:
            #condition
            left = mid+1

    return -1