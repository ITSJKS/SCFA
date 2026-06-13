def isPresent(n, nums, target):
    start = 0
    end = len(nums)-1
    found = False
    while start <=end:
        mid = (start+end)//2
        if nums[mid]==target:
            return mid
        elif nums[mid]<target:
            end = mid-1
        else:
            start = mid+1
    return -1

        
    #write your code here