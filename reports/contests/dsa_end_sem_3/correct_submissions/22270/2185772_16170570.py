def isPresent(n, nums, target):
    #write your code here
    start, end = 0, n-1

    while start<=end:
        mid = start+(end-start)//2
        if nums[mid] == target:
            return mid
        elif nums[mid]>target:
            start = mid+1
        else:
            end = mid-1
    return -1