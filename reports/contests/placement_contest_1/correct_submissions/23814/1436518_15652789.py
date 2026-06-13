def firstOccurrence(nums):
    # print(nums)
    target = 1
    left,right = 0,len(nums)-1
    found = -1
    while left<=right:
        mid = (left+right)//2
        if nums[mid]==target:
            right = mid - 1
            found = mid
        else:
            left = mid + 1
    return found
    # for i in range(len(nums)):
    #     if nums[i]==1:
    #         return i
    # return -1