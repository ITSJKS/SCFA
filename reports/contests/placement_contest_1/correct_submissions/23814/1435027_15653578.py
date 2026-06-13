def firstOccurrence(nums):
    i = 0
    j = len(nums)-1
    # ans = 0
    while i < j:
        mid = (i+j)//2
        # print(mid)
        if nums[mid] == 1:
            j = mid
        else:
            i = mid + 1
    if arr[j] == 2:
        return -1
    else:
        return j